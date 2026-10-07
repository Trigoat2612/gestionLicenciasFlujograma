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

/**
 * Anchuras expresadas en unidades BPMN, NO píxeles de pantalla.
 * Participante (padre) y carril (hijo) ocupan columnas independientes.
 * Los nombres se renderizan mediante overlays HTML con texto horizontal.
 */
export const SWIMLANE_LAYOUT = {
  participantHeaderWidth: 144,
  laneHeaderWidth: 166,
} as const

export function optimizeBpmnForViewer(xml: string): string {
  try {
    const sanitized = sanitizeBpmnXml(xml)
    const doc = new DOMParser().parseFromString(sanitized, 'application/xml')
    if (doc.querySelector('parsererror')) return sanitized

    const { participantHeaderWidth, laneHeaderWidth } = SWIMLANE_LAYOUT
    const contentOffset = participantHeaderWidth + laneHeaderWidth

    // Evitamos la rotación BPMN estándar: las cabeceras se dibujan como
    // overlays HTML en columnas independientes usando los nombres originales.
    const allParticipants = Array.from(doc.getElementsByTagNameNS('*', 'participant'))
    const namedParticipants = new Set(
      allParticipants.filter((p) => (p.getAttribute('name') ?? '').trim()).map((p) => p.getAttribute('id')),
    )
    const laneIds = new Set(
      Array.from(doc.getElementsByTagNameNS('*', 'lane')).map((lane) => lane.getAttribute('id')),
    )

    Array.from(doc.getElementsByTagNameNS('*', 'lane')).forEach((lane) => lane.setAttribute('name', ''))
    allParticipants.forEach((participant) => {
      if (participant.getAttribute('name')) participant.setAttribute('name', '')
    })

    // Se deja el origen X de cada participante en su lugar.
    // Cada carril se mueve a la derecha del encabezado padre; los nodos y
    // conectores se desplazan después de ambas columnas.
    Array.from(doc.getElementsByTagNameNS('*', 'BPMNShape')).forEach((shape) => {
      const targetId = shape.getAttribute('bpmnElement')
      const bounds = Array.from(shape.children).find((child) => child.localName === 'Bounds')
      if (!bounds || !targetId) return

      const x = Number(bounds.getAttribute('x'))
      const width = Number(bounds.getAttribute('width'))
      if (!Number.isFinite(x) || !Number.isFinite(width)) return

      if (namedParticipants.has(targetId)) {
        bounds.setAttribute('width', String(width + contentOffset))
      } else if (laneIds.has(targetId)) {
        bounds.setAttribute('x', String(x + participantHeaderWidth))
        bounds.setAttribute('width', String(width + laneHeaderWidth))
      } else {
        bounds.setAttribute('x', String(x + contentOffset))
      }

      // Conservar la posición de cualquier etiqueta asociada al nodo. Las
      // etiquetas BPMN de pools y carriles no se usan porque están vacías.
      if (!namedParticipants.has(targetId) && !laneIds.has(targetId)) {
        Array.from(shape.getElementsByTagNameNS('*', 'BPMNLabel')).forEach((label) => {
          const labelBounds = Array.from(label.children).find((child) => child.localName === 'Bounds')
          if (!labelBounds) return
          const labelX = Number(labelBounds.getAttribute('x'))
          if (Number.isFinite(labelX)) labelBounds.setAttribute('x', String(labelX + contentOffset))
        })
      }
    })

    Array.from(doc.getElementsByTagNameNS('*', 'BPMNEdge')).forEach((edge) => {
      Array.from(edge.children).filter((child) => child.localName === 'waypoint').forEach((point) => {
        const x = Number(point.getAttribute('x'))
        if (Number.isFinite(x)) point.setAttribute('x', String(x + contentOffset))
      })
      Array.from(edge.getElementsByTagNameNS('*', 'BPMNLabel')).forEach((label) => {
        const labelBounds = Array.from(label.children).find((child) => child.localName === 'Bounds')
        if (!labelBounds) return
        const x = Number(labelBounds.getAttribute('x'))
        if (Number.isFinite(x)) labelBounds.setAttribute('x', String(x + contentOffset))
      })
    })

    return new XMLSerializer().serializeToString(doc)
  } catch {
    return sanitizeBpmnXml(xml)
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
