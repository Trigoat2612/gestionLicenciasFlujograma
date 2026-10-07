import { callTargets } from './data/catalog'

export type BpmnNode = {
  id: string
  type: string
  name: string
  code?: string
  lane?: string
  documentation?: string
  calledElement?: string
  targetDiagramId?: string
  incoming: string[]
  outgoing: string[]
}

export type BpmnFlow = {
  id: string
  name?: string
  sourceRef: string
  targetRef: string
}

export type ParsedBpmn = {
  processNames: string[]
  lanes: string[]
  nodes: BpmnNode[]
  flows: BpmnFlow[]
}

const flowNodeTypes = new Set([
  'task', 'userTask', 'serviceTask', 'manualTask', 'sendTask', 'receiveTask',
  'businessRuleTask', 'scriptTask', 'callActivity', 'subProcess',
  'exclusiveGateway', 'parallelGateway', 'inclusiveGateway', 'eventBasedGateway',
  'complexGateway', 'startEvent', 'endEvent', 'intermediateCatchEvent',
  'intermediateThrowEvent', 'boundaryEvent',
])

export function extractCode(name = ''): string | undefined {
  const match = name.match(/^([A-Z]{1,5}\d{0,2})\s*·/)
  return match?.[1]
}

function stripHtml(value: string): string {
  if (!value.includes('<')) return value.trim()
  const doc = new DOMParser().parseFromString(`<body>${value}</body>`, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export function sanitizeBpmnXml(xml: string): string {
  try {
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) return xml

    const removableParticipants = Array.from(doc.getElementsByTagNameNS('*', 'participant')).filter((participant) => {
      const name = participant.getAttribute('name')?.trim()
      const processRef = participant.getAttribute('processRef')
      if (name || !processRef) return false

      const process = Array.from(doc.getElementsByTagNameNS('*', 'process')).find((candidate) => candidate.getAttribute('id') === processRef)
      if (!process) return false

      const hasFlowNodes = Array.from(process.children).some((child) => flowNodeTypes.has(child.localName))
      return !hasFlowNodes
    })

    if (!removableParticipants.length) return xml

    const removableIds = new Set(removableParticipants.map((participant) => participant.getAttribute('id')).filter(Boolean) as string[])
    const removableProcessIds = new Set(removableParticipants.map((participant) => participant.getAttribute('processRef')).filter(Boolean) as string[])

    removableParticipants.forEach((participant) => participant.parentNode?.removeChild(participant))

    Array.from(doc.getElementsByTagNameNS('*', 'process'))
      .filter((process) => removableProcessIds.has(process.getAttribute('id') || ''))
      .forEach((process) => process.parentNode?.removeChild(process))

    Array.from(doc.getElementsByTagNameNS('*', 'BPMNShape'))
      .filter((shape) => removableIds.has(shape.getAttribute('bpmnElement') || ''))
      .forEach((shape) => shape.parentNode?.removeChild(shape))

    return new XMLSerializer().serializeToString(doc)
  } catch {
    return xml
  }
}

export function parseBpmn(xml: string): ParsedBpmn {
  const safeXml = sanitizeBpmnXml(xml)
  const doc = new DOMParser().parseFromString(safeXml, 'application/xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) throw new Error('El archivo BPMN no pudo ser interpretado como XML válido.')

  const laneByNode = new Map<string, string>()
  const lanes: string[] = []

  Array.from(doc.getElementsByTagNameNS('*', 'lane')).forEach((lane) => {
    const laneName = lane.getAttribute('name') || 'Carril sin nombre'
    lanes.push(laneName)
    Array.from(lane.children)
      .filter((x) => x.localName === 'flowNodeRef')
      .forEach((ref) => {
        if (ref.textContent) laneByNode.set(ref.textContent.trim(), laneName)
      })
  })

  const flows: BpmnFlow[] = Array.from(doc.getElementsByTagNameNS('*', 'sequenceFlow')).map((flow) => ({
    id: flow.getAttribute('id') || '',
    name: flow.getAttribute('name') || undefined,
    sourceRef: flow.getAttribute('sourceRef') || '',
    targetRef: flow.getAttribute('targetRef') || '',
  }))

  const incoming = new Map<string, string[]>()
  const outgoing = new Map<string, string[]>()
  for (const flow of flows) {
    incoming.set(flow.targetRef, [...(incoming.get(flow.targetRef) ?? []), flow.id])
    outgoing.set(flow.sourceRef, [...(outgoing.get(flow.sourceRef) ?? []), flow.id])
  }

  const nodes: BpmnNode[] = []
  const all = Array.from(doc.getElementsByTagName('*'))
  for (const element of all) {
    if (!flowNodeTypes.has(element.localName)) continue
    const id = element.getAttribute('id')
    if (!id) continue
    const name = element.getAttribute('name') || element.localName
    const code = extractCode(name)
    const documentationElement = Array.from(element.children).find((x) => x.localName === 'documentation')
    const documentation = documentationElement?.textContent ? stripHtml(documentationElement.textContent) : undefined
    nodes.push({
      id,
      type: element.localName,
      name,
      code,
      lane: laneByNode.get(id),
      documentation,
      calledElement: element.getAttribute('calledElement') || undefined,
      targetDiagramId: code ? callTargets[code] : undefined,
      incoming: incoming.get(id) ?? [],
      outgoing: outgoing.get(id) ?? [],
    })
  }

  const processNames = Array.from(doc.getElementsByTagNameNS('*', 'process'))
    .map((process) => process.getAttribute('name'))
    .filter((x): x is string => Boolean(x))

  return {
    processNames: Array.from(new Set(processNames)),
    lanes: Array.from(new Set(lanes)),
    nodes,
    flows,
  }
}

const modules = import.meta.glob('./bpmn/*.bpmn', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const bpmnSources = Object.fromEntries(
  Object.entries(modules).map(([path, xml]) => [path.split('/').pop()!, xml]),
) as Record<string, string>
