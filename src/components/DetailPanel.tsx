import { ArrowRight, ExternalLink, Route, UserRound, FileCheck2, Link2, AlertTriangle } from 'lucide-react'
import { diagrams } from '../data/catalog'
import { activityReference } from '../data/procedure'
import type { BpmnFlow, BpmnNode } from '../lib-bpmn'

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    task: 'Actividad', sendTask: 'Envío', receiveTask: 'Recepción', callActivity: 'Subproceso',
    startEvent: 'Inicio', endEvent: 'Fin', intermediateCatchEvent: 'Evento de recepción',
    intermediateThrowEvent: 'Evento intermedio', boundaryEvent: 'Evento de borde',
    exclusiveGateway: 'Decisión exclusiva', parallelGateway: 'Compuerta paralela',
    inclusiveGateway: 'Decisión inclusiva', subProcess: 'Subproceso',
  }
  return labels[type] ?? type
}

export function DetailPanel({
  node,
  flows,
  onOpenDiagram,
}: {
  node?: BpmnNode
  flows: BpmnFlow[]
  onOpenDiagram: (id: string) => void
}) {
  if (!node) {
    return (
      <aside className="detail-panel empty-detail">
        <Route size={30} />
        <h3>Explora el flujo</h3>
        <p>Selecciona una actividad, evento o compuerta del BPMN para ver responsable, evidencia, conexiones y navegación al detalle.</p>
      </aside>
    )
  }

  const ref = node.code ? activityReference[node.code] : undefined
  const incoming = flows.filter((f) => node.incoming.includes(f.id))
  const outgoing = flows.filter((f) => node.outgoing.includes(f.id))
  const target = node.targetDiagramId ? diagrams.find((d) => d.id === node.targetDiagramId) : undefined
  const manualAssociation = Boolean(target && !node.calledElement)

  return (
    <aside className="detail-panel">
      <div className="detail-kicker">{typeLabel(node.type)} {node.code ? `· ${node.code}` : ''}</div>
      <h2>{node.name.replace(/^([A-Z]{1,5}\d{0,2})\s*·\s*/, '')}</h2>

      {(node.lane || ref?.responsible) && (
        <div className="detail-block">
          <div className="detail-label"><UserRound size={15} /> Responsable</div>
          <p>{ref?.responsible ?? node.lane}</p>
          {node.lane && ref?.responsible && node.lane !== ref.responsible && <small>Carril BPMN: {node.lane}</small>}
        </div>
      )}

      {ref?.evidence && (
        <div className="detail-block">
          <div className="detail-label"><FileCheck2 size={15} /> Evidencia esperada</div>
          <p>{ref.evidence}</p>
        </div>
      )}

      {node.documentation && (
        <div className="detail-block">
          <div className="detail-label"><Link2 size={15} /> Nota del BPMN</div>
          <p>{node.documentation}</p>
        </div>
      )}

      {(incoming.length > 0 || outgoing.length > 0) && (
        <div className="detail-block compact">
          <div className="detail-label"><Route size={15} /> Conexiones</div>
          {incoming.slice(0, 3).map((flow) => <p key={flow.id} className="flow-line">← {flow.name || 'Flujo de entrada'}</p>)}
          {outgoing.slice(0, 4).map((flow) => <p key={flow.id} className="flow-line"><ArrowRight size={13} /> {flow.name || 'Flujo de salida'}</p>)}
        </div>
      )}

      {manualAssociation && (
        <div className="association-warning">
          <AlertTriangle size={16} />
          <span>La asociación al detalle está indicada por el procedimiento, pero no viene enlazada nativamente en este BPMN exportado.</span>
        </div>
      )}

      {target && (
        <button type="button" className="open-subprocess" onClick={() => onOpenDiagram(target.id)}>
          <ExternalLink size={16} /> Abrir {target.shortTitle}
        </button>
      )}
    </aside>
  )
}
