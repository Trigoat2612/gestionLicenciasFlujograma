import { useState } from 'react'
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, Database,
  FileCheck2, GitBranch, Layers3, ListChecks, PlayCircle, RefreshCcw, ShieldCheck,
  UsersRound, Workflow, Zap,
} from 'lucide-react'
import { pendingScenarios, procedure } from '../data/procedure'

type ExecutivePresentationProps = {
  onOpenDiagram: (id: string) => void
  onOpenPending: () => void
}

type JourneyStep = {
  id: string
  title: string
  actor: string
  description: string
  decision: string
  output: string
  diagramId?: string
}

type Scenario = {
  id: string
  title: string
  trigger: string
  executiveMessage: string
  result: string
  diagramId: string
  attention?: string
}

const journey: JourneyStep[] = [
  {
    id: 'autorizar',
    title: '1. Autorizar necesidad',
    actor: 'PJ · Instancia de aceptación',
    description: 'La necesidad debe estar aceptada o preaceptada antes de pedir una licencia.',
    decision: '¿Existe respaldo válido?',
    output: 'Necesidad habilitada para registro y atención.',
    diagramId: '01',
  },
  {
    id: 'clasificar',
    title: '2. Clasificar operación',
    actor: 'Gestión de Servicios PJ',
    description: 'Se define si corresponde alta, baja, modificación, reporte o ajuste de inventario.',
    decision: '¿Qué operación corresponde?',
    output: 'Caso registrado con usuario/recurso, licencia, prioridad y evidencia.',
    diagramId: '01',
  },
  {
    id: 'capacidad',
    title: '3. Verificar capacidad',
    actor: 'Gestión de Servicios PJ',
    description: 'Se revisa inventario, disponibilidad, provisión contratada o ampliación autorizada.',
    decision: '¿Hay licencia disponible o capacidad contratada?',
    output: 'Licencia reservada, solicitud de provisión o ampliación sustentada.',
    diagramId: '03',
  },
  {
    id: 'softplan',
    title: '4. Ejecutar con Softplan',
    actor: 'Mesa / Ejecutor técnico Softplan',
    description: 'Softplan valida datos, observa si falta información y ejecuta la operación técnica.',
    decision: '¿Solicitud válida y ejecutable?',
    output: 'Respuesta observada o atendida con evidencia técnica.',
    diagramId: '02',
  },
  {
    id: 'validar',
    title: '5. Validar resultado e inventario',
    actor: 'Área usuaria + Gestión de Servicios PJ',
    description: 'El PJ confirma el resultado, actualiza estados y conserva evidencia.',
    decision: '¿Resultado confirmado y trazable?',
    output: 'Inventario actualizado: asignada, liberada, disponible, vencida o cancelada.',
    diagramId: '08',
  },
  {
    id: 'control',
    title: '6. Conciliar y regularizar',
    actor: 'Gestión de Servicios / Unidad administrativa PJ',
    description: 'La conciliación y regularización se controlan por separado del resultado técnico.',
    decision: '¿Existen diferencias o ampliaciones por cerrar?',
    output: 'Diferencias cerradas y regularización documentada.',
    diagramId: '06',
  },
]

const scenarios: Scenario[] = [
  {
    id: 'alta',
    title: 'Alta / asignación',
    trigger: 'Nuevo usuario o recurso requiere licencia.',
    executiveMessage: 'Primero se verifica autorización y capacidad. Si no hay licencia disponible, se distingue provisión contratada de ampliación adicional.',
    result: 'Licencia asignada, acceso confirmado e inventario actualizado.',
    diagramId: '03',
    attention: 'Una ampliación no se habilita solo por urgencia: necesita respaldo contractual.',
  },
  {
    id: 'baja',
    title: 'Baja / liberación',
    trigger: 'Usuario, recurso o asignación deja de requerir licencia.',
    executiveMessage: 'Se libera la licencia y luego se decide si queda disponible, vencida o cancelada.',
    result: 'Desasociación confirmada y estado de licencia controlado.',
    diagramId: '04',
  },
  {
    id: 'modificacion',
    title: 'Modificación',
    trigger: 'Cambio de condición, perfil o necesidad operativa.',
    executiveMessage: 'La nueva condición se valida antes de liberar la licencia anterior para evitar pérdida de continuidad.',
    result: 'Nueva licencia validada, licencia anterior tratada e inventario actualizado.',
    diagramId: '05',
    attention: 'La liberación anterior no debe adelantarse a la validación de la nueva condición.',
  },
  {
    id: 'conciliacion',
    title: 'Conciliación',
    trigger: 'Control periódico o necesidad de comparar reporte contra inventario.',
    executiveMessage: 'Se contrasta reporte Softplan vs. inventario maestro PJ y se tratan diferencias con evidencia.',
    result: 'Diferencias cerradas o justificadas, sin correcciones manuales sin sustento.',
    diagramId: '06',
  },
]

const responsibilityRows = [
  ['Área usuaria', 'Sustenta necesidad y confirma acceso o resultado.'],
  ['Instancia de aceptación', 'Confirma aceptación o preaceptación antes de operar.'],
  ['Gestión de Servicios PJ', 'Registra, clasifica, controla inventario, coordina COM y concilia.'],
  ['Unidad administrativa PJ', 'Regulariza ampliaciones, facturación, conformidad o pago cuando corresponda.'],
  ['Softplan', 'Valida tickets, ejecuta operaciones técnicas y entrega evidencia.'],
]

const executiveControls = [
  { title: 'Autorización previa', detail: 'Sin necesidad aceptada no debe ejecutarse una asignación o cambio.' },
  { title: 'Control de capacidad', detail: 'Distingue disponible, contratado pendiente y ampliación adicional.' },
  { title: 'Trazabilidad', detail: 'Caso, solicitud, ticket, licencia, evidencia y cierre deben relacionarse.' },
  { title: 'Cierres separados', detail: 'Resultado técnico, inventario y regularización administrativa no son lo mismo.' },
]

const indicators = [
  ['Atención dentro del ANS', 'Mide cumplimiento del plazo aplicable.'],
  ['Solicitudes observadas', 'Detecta calidad de datos enviados a Softplan.'],
  ['Inventario actualizado', 'Confirma cierre operativo con evidencia.'],
  ['Diferencias cerradas', 'Controla conciliación e integridad del inventario.'],
]

export function ExecutivePresentation({ onOpenDiagram, onOpenPending }: ExecutivePresentationProps) {
  const [activeStep, setActiveStep] = useState(journey[0])
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const activeStepDiagramId = activeStep.diagramId

  return (
    <section className="executive-page">
      <div className="executive-hero">
        <div className="executive-hero-copy">
          <span className="eyebrow">Vista general · Base estable v1.0</span>
          <h1>Gestión integral de licencias STEJENP</h1>
          <p>
            Lectura compacta del procedimiento para entender responsabilidades, controles, escenarios operativos y puntos de decisión desde el inicio.
          </p>
          <div className="executive-actions">
            <button className="primary-action" onClick={() => onOpenDiagram('n0')}><Workflow size={17} /> Ver BPMN integral</button>
            <button className="secondary-action" onClick={onOpenPending}><AlertTriangle size={17} /> Ver pendientes</button>
          </div>
        </div>
        <div className="executive-scoreboard">
          <div><strong>5</strong><span>operaciones controladas</span></div>
          <div><strong>6</strong><span>estados de licencia</span></div>
          <div><strong>12</strong><span>diagramas vinculados</span></div>
          <div><strong>4</strong><span>controles críticos</span></div>
        </div>
      </div>

      <div className="executive-grid">
        <article className="executive-card executive-card-wide">
          <div className="executive-card-heading">
            <PlayCircle size={20} />
            <div>
              <h2>Mensaje central</h2>
              <p>El procedimiento no “crea usuarios”: controla el derecho de uso de licencias y su evidencia.</p>
            </div>
          </div>
          <div className="executive-message-strip">
            <div><ShieldCheck size={18} /><strong>PJ decide y valida</strong><span>autoriza, inventaria y confirma resultado</span></div>
            <ArrowRight size={18} />
            <div><Zap size={18} /><strong>Softplan ejecuta</strong><span>valida solicitud, opera técnicamente y entrega evidencia</span></div>
            <ArrowRight size={18} />
            <div><Database size={18} /><strong>Inventario gobierna</strong><span>evita duplicidad, sobreuso y cierres sin sustento</span></div>
          </div>
        </article>

        <article className="executive-card executive-card-wide">
          <div className="executive-card-heading">
            <GitBranch size={20} />
            <div>
              <h2>Recorrido del proceso</h2>
              <p>Seis pasos de control. Selecciona uno para ver decisión, actor y salida esperada.</p>
            </div>
          </div>
          <div className="journey-layout">
            <div className="journey-rail">
              {journey.map((step) => (
                <button key={step.id} className={activeStep.id === step.id ? 'active' : ''} onClick={() => setActiveStep(step)}>
                  <span>{step.title.split('.')[0]}</span>
                  <strong>{step.title.replace(/^\d\.\s*/, '')}</strong>
                </button>
              ))}
            </div>
            <div className="journey-detail">
              <span className="detail-kicker">{activeStep.actor}</span>
              <h3>{activeStep.title}</h3>
              <p>{activeStep.description}</p>
              <div className="decision-box"><ListChecks size={17} /><div><strong>Decisión clave</strong><span>{activeStep.decision}</span></div></div>
              <div className="decision-box"><FileCheck2 size={17} /><div><strong>Salida esperada</strong><span>{activeStep.output}</span></div></div>
              {activeStepDiagramId && <button className="link-action" onClick={() => onOpenDiagram(activeStepDiagramId)}>Abrir detalle BPMN <ArrowRight size={15} /></button>}
            </div>
          </div>
        </article>

        <article className="executive-card executive-card-wide">
          <div className="executive-card-heading">
            <Layers3 size={20} />
            <div>
              <h2>Escenarios operativos</h2>
            </div>
          </div>
          <div className="scenario-tabs">
            {scenarios.map((scenario) => <button key={scenario.id} className={activeScenario.id === scenario.id ? 'active' : ''} onClick={() => setActiveScenario(scenario)}>{scenario.title}</button>)}
          </div>
          <div className="scenario-panel">
            <div>
              <span>Disparador</span>
              <strong>{activeScenario.trigger}</strong>
            </div>
            <div>
              <span>Detalle</span>
              <p>{activeScenario.executiveMessage}</p>
            </div>
            <div>
              <span>Resultado esperado</span>
              <p>{activeScenario.result}</p>
            </div>
            {activeScenario.attention && <div className="attention-note"><AlertTriangle size={16} />{activeScenario.attention}</div>}
            <button className="link-action" onClick={() => onOpenDiagram(activeScenario.diagramId)}>Ver BPMN del escenario <ArrowRight size={15} /></button>
          </div>
        </article>

        <article className="executive-card">
          <div className="executive-card-heading"><UsersRound size={20} /><div><h2>Responsabilidades</h2><p>Quién debe mirar qué.</p></div></div>
          <div className="responsibility-list">
            {responsibilityRows.map(([role, duty]) => <div key={role}><strong>{role}</strong><span>{duty}</span></div>)}
          </div>
        </article>

        <article className="executive-card">
          <div className="executive-card-heading"><ClipboardCheck size={20} /><div><h2>Controles críticos</h2><p>No negociables del procedimiento.</p></div></div>
          <div className="control-list">
            {executiveControls.map((control) => <div key={control.title}><CheckCircle2 size={16} /><div><strong>{control.title}</strong><span>{control.detail}</span></div></div>)}
          </div>
        </article>

        <article className="executive-card">
          <div className="executive-card-heading"><BarChart3 size={20} /><div><h2>Indicadores gerenciales</h2><p>Seguimiento sugerido.</p></div></div>
          <div className="indicator-list">
            {indicators.map(([name, detail]) => <div key={name}><strong>{name}</strong><span>{detail}</span></div>)}
          </div>
        </article>

        <article className="executive-card">
          <div className="executive-card-heading"><RefreshCcw size={20} /><div><h2>Pendientes de formalización</h2><p>Temas que requieren decisión antes de versión operativa.</p></div></div>
          <div className="pending-mini-list">
            {pendingScenarios.slice(0, 3).map((item) => <div key={item.title}><AlertTriangle size={15} /><span>{item.title}</span></div>)}
          </div>
          <button className="link-action" onClick={onOpenPending}>Revisar todos <ArrowRight size={15} /></button>
        </article>
      </div>

      <div className="executive-footer-note">
        <strong>Alcance:</strong> {procedure.scope}
      </div>
    </section>
  )
}
