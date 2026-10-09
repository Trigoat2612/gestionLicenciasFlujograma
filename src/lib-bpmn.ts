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

    const participants = Array.from(doc.getElementsByTagNameNS('*', 'participant'))
    const lanes = Array.from(doc.getElementsByTagNameNS('*', 'lane'))
    const shapes = Array.from(doc.getElementsByTagNameNS('*', 'BPMNShape'))

    const processIdByLaneId = new Map<string, string>()
    Array.from(doc.getElementsByTagNameNS('*', 'process')).forEach((process) => {
      const processId = process.getAttribute('id') ?? ''
      Array.from(process.getElementsByTagNameNS('*', 'lane')).forEach((lane) => {
        const laneId = lane.getAttribute('id')
        if (laneId) processIdByLaneId.set(laneId, processId)
      })
    })

    const participantIdByProcessId = new Map<string, string>()
    participants.forEach((participant) => {
      const participantId = participant.getAttribute('id')
      const processRef = participant.getAttribute('processRef')
      if (participantId && processRef) participantIdByProcessId.set(processRef, participantId)
    })

    type BoundsSnapshot = { x: number; y: number; width: number; height: number }
    const originalBounds = new Map<string, BoundsSnapshot>()
    shapes.forEach((shape) => {
      const id = shape.getAttribute('bpmnElement')
      const bounds = Array.from(shape.children).find((child) => child.localName === 'Bounds')
      if (!id || !bounds) return
      const snapshot = {
        x: Number(bounds.getAttribute('x')),
        y: Number(bounds.getAttribute('y')),
        width: Number(bounds.getAttribute('width')),
        height: Number(bounds.getAttribute('height')),
      }
      if (Object.values(snapshot).every(Number.isFinite)) originalBounds.set(id, snapshot)
    })

    const participantIds = new Set(participants.map((p) => p.getAttribute('id')).filter(Boolean) as string[])
    const laneIds = new Set(lanes.map((lane) => lane.getAttribute('id')).filter(Boolean) as string[])

    // Los nombres de pool/lane se dibujan con overlays HTML horizontales.
    lanes.forEach((lane) => lane.setAttribute('name', ''))
    participants.forEach((participant) => {
      if (participant.getAttribute('name')) participant.setAttribute('name', '')
    })

    // Bizagi exporta ciertos boundary events con nombre y etiqueta sobre el mismo punto.
    // Cuando una actividad concentra tres o más controles, ocultamos esos rótulos en la
    // vista general y reducimos ligeramente el círculo. El nombre completo sigue disponible
    // en el panel de detalle porque se parsea desde el XML original.
    const boundaryEvents = Array.from(doc.getElementsByTagNameNS('*', 'boundaryEvent'))
    const boundaryByActivity = new Map<string, Element[]>()
    boundaryEvents.forEach((event) => {
      const attachedToRef = event.getAttribute('attachedToRef')
      if (!attachedToRef) return
      boundaryByActivity.set(attachedToRef, [...(boundaryByActivity.get(attachedToRef) ?? []), event])
    })
    const compactBoundaryIds = new Set<string>()
    boundaryByActivity.forEach((events) => {
      if (events.length < 3) return
      events.forEach((event) => {
        const id = event.getAttribute('id')
        if (!id) return
        compactBoundaryIds.add(id)
        event.setAttribute('name', '')
      })
    })

    shapes.forEach((shape) => {
      const targetId = shape.getAttribute('bpmnElement')
      const bounds = Array.from(shape.children).find((child) => child.localName === 'Bounds')
      if (!bounds || !targetId) return

      const current = originalBounds.get(targetId)
      if (!current) return

      if (participantIds.has(targetId)) {
        // El pool conserva su X original y crece exactamente lo mismo que la suma
        // de las dos columnas de cabecera.
        bounds.setAttribute('width', String(current.width + contentOffset))
      } else if (laneIds.has(targetId)) {
        // Todos los lanes hijos de un mismo pool empiezan y terminan en los mismos X.
        // Esto evita el descuadre producido por los márgenes internos que exporta Bizagi.
        const processId = processIdByLaneId.get(targetId)
        const participantId = processId ? participantIdByProcessId.get(processId) : undefined
        const participantBounds = participantId ? originalBounds.get(participantId) : undefined

        if (participantBounds) {
          bounds.setAttribute('x', String(participantBounds.x + participantHeaderWidth))
          bounds.setAttribute('width', String(participantBounds.width + laneHeaderWidth))
        } else {
          bounds.setAttribute('x', String(current.x + participantHeaderWidth))
          bounds.setAttribute('width', String(current.width + laneHeaderWidth))
        }
      } else {
        bounds.setAttribute('x', String(current.x + contentOffset))
      }

      if (compactBoundaryIds.has(targetId)) {
        const originalWidth = current.width
        const originalHeight = current.height
        const compactSize = Math.max(28, Math.min(32, Math.min(originalWidth, originalHeight)))
        const dx = (originalWidth - compactSize) / 2
        const dy = (originalHeight - compactSize) / 2
        bounds.setAttribute('x', String(current.x + contentOffset + dx))
        bounds.setAttribute('y', String(current.y + dy))
        bounds.setAttribute('width', String(compactSize))
        bounds.setAttribute('height', String(compactSize))
      }

      // Las etiquetas de nodos normales se desplazan con el contenido.
      if (!participantIds.has(targetId) && !laneIds.has(targetId)) {
        Array.from(shape.getElementsByTagNameNS('*', 'BPMNLabel')).forEach((label) => {
          const labelBounds = Array.from(label.children).find((child) => child.localName === 'Bounds')
          if (!labelBounds) return
          if (compactBoundaryIds.has(targetId)) {
            labelBounds.setAttribute('width', '0')
            labelBounds.setAttribute('height', '0')
            return
          }
          const labelX = Number(labelBounds.getAttribute('x'))
          if (Number.isFinite(labelX)) labelBounds.setAttribute('x', String(labelX + contentOffset))
        })
      }
    })

    // Los conectores se desplazan la misma distancia que las actividades.
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
