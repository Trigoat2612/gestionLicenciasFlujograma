import { useEffect, useRef } from 'react'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import type { BpmnNode } from '../lib-bpmn'

export function BpmnViewer({
  xml,
  selectedNode,
  onNodeSelect,
}: {
  xml: string
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
  }, [xml, onNodeSelect])

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
