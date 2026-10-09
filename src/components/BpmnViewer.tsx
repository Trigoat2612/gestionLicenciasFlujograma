import { useEffect, useRef } from 'react'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import { SWIMLANE_LAYOUT, type BpmnNode } from '../lib-bpmn'

function readSwimlaneNames(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  const processByLane = new Map<string, string>()
  Array.from(doc.getElementsByTagNameNS('*', 'process')).forEach((process) => {
    const processId = process.getAttribute('id') ?? ''
    Array.from(process.getElementsByTagNameNS('*', 'lane')).forEach((lane) => {
      const laneId = lane.getAttribute('id') ?? ''
      if (laneId) processByLane.set(laneId, processId)
    })
  })

  const lanes = Array.from(doc.getElementsByTagNameNS('*', 'lane'))
    .map((lane) => ({
      id: lane.getAttribute('id') ?? '',
      name: lane.getAttribute('name')?.trim() ?? '',
      processRef: processByLane.get(lane.getAttribute('id') ?? '') ?? '',
    }))
    .filter((lane) => lane.id && lane.name)

  const participants = Array.from(doc.getElementsByTagNameNS('*', 'participant'))
    .map((participant) => ({
      id: participant.getAttribute('id') ?? '',
      name: participant.getAttribute('name')?.trim() ?? '',
      processRef: participant.getAttribute('processRef') ?? '',
    }))
    .filter((participant) => participant.id && participant.name && participant.processRef)

  return { lanes, participants }
}

function buildSwimlaneHeader(
  name: string,
  height: number,
  type: 'participant' | 'lane',
) {
  const header = document.createElement('div')
  header.className = type === 'participant' ? 'bpmn-participant-header' : 'bpmn-lane-header'
  header.style.height = `${Math.max(30, height - 2)}px`
  header.style.width = `${type === 'participant' ? SWIMLANE_LAYOUT.participantHeaderWidth - 1 : SWIMLANE_LAYOUT.laneHeaderWidth - 1}px`
  header.title = name

  const label = document.createElement('span')
  label.textContent = name
  header.appendChild(label)
  return header
}

function addSwimlaneHeaders(viewer: any, sourceXml: string) {
  const overlays = viewer.get('overlays')
  const registry = viewer.get('elementRegistry')
  const { lanes, participants } = readSwimlaneNames(sourceXml)

  overlays.clear()

  // Carriles hijos: segunda columna.
  for (const lane of lanes) {
    const element = registry.get(lane.id)
    if (!element) continue
    overlays.add(lane.id, {
      position: { top: 1, left: 1 },
      html: buildSwimlaneHeader(lane.name, element.height ?? 100, 'lane'),
      show: { minZoom: 0.2, maxZoom: 5 },
    })
  }

  // Participante / pool padre: primera columna.
  // bpmn-js no posiciona de forma fiable overlays directamente sobre un
  // Participant en todos los BPMN exportados por Bizagi. Por eso usamos como
  // ancla el primer lane hijo y calculamos la posición relativa real del pool.
  for (const participant of participants) {
    const participantElement = registry.get(participant.id)
    if (!participantElement) continue

    const childLane = lanes
      .filter((lane) => lane.processRef === participant.processRef)
      .map((lane) => ({ lane, element: registry.get(lane.id) }))
      .filter((item) => item.element)
      .sort((a, b) => (a.element.y ?? 0) - (b.element.y ?? 0))[0]

    if (!childLane) continue

    const laneElement = childLane.element
    const relativeLeft = (participantElement.x ?? 0) - (laneElement.x ?? 0) + 1
    const relativeTop = (participantElement.y ?? 0) - (laneElement.y ?? 0) + 1

    overlays.add(childLane.lane.id, {
      position: { top: relativeTop, left: relativeLeft },
      html: buildSwimlaneHeader(participant.name, participantElement.height ?? laneElement.height ?? 100, 'participant'),
      show: { minZoom: 0.2, maxZoom: 5 },
    })
  }
}

export function BpmnViewer({
  xml,
  sourceXml,
  selectedNode,
  onNodeSelect,
}: {
  xml: string
  sourceXml: string
  selectedNode?: BpmnNode
  onNodeSelect: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const viewer = new NavigatedViewer({ container: containerRef.current })
    viewerRef.current = viewer

    viewer.importXML(xml).then(() => {
      const canvas = viewer.get('canvas')
      addSwimlaneHeaders(viewer, sourceXml)
      canvas.zoom('fit-viewport')
    })

    viewer.on('element.click', (event: any) => {
      const bo = event.element?.businessObject
      if (!bo?.id || event.element?.type === 'label') return
      onNodeSelect(bo.id)
    })

    const observer = new ResizeObserver(() => {
      const canvas = viewer.get('canvas')
      canvas.resized()
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      viewer.destroy()
      viewerRef.current = null
    }
  }, [xml, sourceXml, onNodeSelect])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    const canvas = viewer.get('canvas')
    const registry = viewer.get('elementRegistry')
    registry.getAll().forEach((element: any) => {
      if (element.id) canvas.removeMarker(element.id, 'node-selected')
    })
    if (selectedNode && registry.get(selectedNode.id)) {
      canvas.addMarker(selectedNode.id, 'node-selected')
    }
  }, [selectedNode])

  const zoom = (factor: number) => {
    const canvas = viewerRef.current?.get('canvas')
    if (!canvas) return
    const current = canvas.zoom()
    canvas.zoom(Math.max(0.2, Math.min(4, current * factor)))
  }

  const fit = () => viewerRef.current?.get('canvas')?.zoom('fit-viewport')

  return (
    <div className="diagram-stage">
      <div ref={containerRef} className="bpmn-canvas" aria-label="Diagrama BPMN interactivo" />
      <div className="diagram-tools" aria-label="Controles del diagrama">
        <button type="button" onClick={() => zoom(1.2)} title="Acercar">+</button>
        <button type="button" onClick={() => zoom(1 / 1.2)} title="Alejar">−</button>
        <button type="button" onClick={fit} title="Ajustar al área">⌂</button>
      </div>
    </div>
  )
}
