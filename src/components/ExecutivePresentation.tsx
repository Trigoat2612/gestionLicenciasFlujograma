import { useState } from 'react'
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, Database,
  FileCheck2, GitBranch, Layers3, ListChecks, PlayCircle, RefreshCcw, ShieldCheck,
  UsersRound, Workflow, Zap, ChevronDown,
} from 'lucide-react'
import { diagrams } from '../data/catalog'
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

type SummaryPanel = 'operations' | 'states' | 'diagrams' | 'controls'

const journey: JourneyStep[] = [
  {
    id: 'autorizar',
    title: '1. Autorizar necesidad',
    actor: 'PJ · Instancia de aceptación',
    description: 'Se verifica el respaldo y las facultades aplicables antes de registrar y ejecutar una operación de licencia.',
    decision: '¿Existe respaldo suficiente y válido?',
    output: 'Necesidad habilitada para registro y clasificación.',
    diagramId: '01',
  },
  {
    id: 'clasificar',
    title: '2. Clasificar operación',
    actor: 'Gestión de Servicios PJ',
    description: 'El caso se registra y se clasifica como alta, baja, modificación, suspensión/reactivación, carga masiva o consulta/confirmación.',
    decision: '¿Qué tipo de operación corresponde?',
    output: 'Caso, prioridad, usuario/recurso y licencia identificados.',
    diagramId: '01',
  },
  {
    id: 'capacidad',
    title: '3. Verificar capacidad y estado',
    actor: 'Gestión de Servicios PJ',
    description: 'Se revisan inventario, disponibilidad, reutilización, capacidad contratada, ampliación y reservas antes de ejecutar.',
    decision: '¿Existe capacidad o condición habilitante para continuar?',
    output: 'Licencia reservada, capacidad preparada o impedimento registrado.',
    diagramId: '03',
  },
  {
    id: 'ejecutar',
    title: '4. Ejecutar operación',
    actor: 'Ejecutor PJ habilitado / Softplan',
    description: 'La ejecución se realiza por el actor formalmente facultado. Softplan valida y procesa cuando la operación debe tramitarse con el proveedor.',
    decision: '¿Quién está facultado y técnicamente habilitado para ejecutar?',
    output: 'Operación ejecutada o impedimento trazado con evidencia.',
    diagramId: '10',
  },
  {
    id: 'validar',
    title: '5. Validar resultado y estados',
    actor: 'Área usuaria + Gestión de Servicios PJ',
    description: 'El resultado se confirma antes del cierre y se actualizan los estados reales de la licencia y del inventario.',
    decision: '¿Resultado confirmado, vigente y trazable?',
    output: 'Inventario actualizado y evidencia vinculada al caso.',
    diagramId: '05',
  },
  {
    id: 'controlar',
    title: '6. Controlar continuidad y plazos',
    actor: 'Gestión de Servicios / Dirección Ejecutiva PJ',
    description: 'Se controlan ANS, reservas, licencias temporales, pendientes e incidencias que requieren seguimiento o escalamiento.',
    decision: '¿Existe vencimiento, bloqueo, reserva o temporalidad por atender?',
    output: 'Seguimiento programado, escalamiento o control cerrado con evidencia.',
    diagramId: '16',
  },
  {
    id: 'conciliar',
    title: '7. Conciliar y regularizar',
    actor: 'Gestión de Servicios / Unidad administrativa PJ',
    description: 'La conciliación, la regularización administrativa y el registro comercial se controlan por separado del resultado técnico.',
    decision: '¿Existen diferencias, ampliaciones o contingencias por cerrar?',
    output: 'Diferencias tratadas y regularizaciones documentadas.',
    diagramId: '06',
  },
]

const scenarios: Scenario[] = [
  {
    id: 'alta',
    title: 'Alta / asignación',
    trigger: 'Nuevo usuario o recurso requiere licencia.',
    executiveMessage: 'Se verifica autorización, disponibilidad, reutilización y capacidad. La ejecución puede ser interna si el PJ está formalmente habilitado o tramitarse con Softplan.',
    result: 'Licencia asignada, acceso confirmado e inventario actualizado.',
    diagramId: '03',
    attention: 'Las provisiones y ampliaciones técnicas se remiten a Softplan; la asignación interna solo aplica dentro de capacidad habilitada.',
  },
  {
    id: 'baja',
    title: 'Baja / liberación',
    trigger: 'La licencia deja de ser requerida o debe retirarse.',
    executiveMessage: 'Se confirma la liberación y luego se determina si la licencia queda disponible, vencida o cancelada.',
    result: 'Desasociación confirmada y estado final de la licencia registrado.',
    diagramId: '04',
  },
  {
    id: 'modificacion',
    title: 'Modificación',
    trigger: 'Cambio de condición, necesidad operativa o licencia.',
    executiveMessage: 'Se valida la nueva condición antes de liberar la anterior, salvo retiro previo por seguridad debidamente autorizado.',
    result: 'Nueva condición registrada y licencia anterior tratada según vigencia y reutilización.',
    diagramId: '05',
    attention: 'Si falla la validación de la nueva condición, la licencia anterior no debe liberarse hasta resolver la incidencia.',
  },
  {
    id: 'suspension',
    title: 'Suspensión / reactivación',
    trigger: 'Se requiere suspender temporalmente o reactivar una licencia vigente.',
    executiveMessage: 'La operación exige causal y autorización; la reactivación además verifica vigencia y alcance habilitado.',
    result: 'Estado SUSPENDIDA o ASIGNADA registrado con evidencia.',
    diagramId: '15',
  },
  {
    id: 'lotes',
    title: 'Carga masiva',
    trigger: 'Despliegue o lote de usuarios requiere atención coordinada.',
    executiveMessage: 'Se valida la matriz, se concilia capacidad, se atiende cada fila como una operación individual y se consolidan incidencias y sobrantes.',
    result: 'Lote conciliado con resultados, pendientes y capacidad controlada.',
    diagramId: '14',
  },
  {
    id: 'conciliacion',
    title: 'Conciliación',
    trigger: 'Control periódico de inventario y capacidad.',
    executiveMessage: 'Se compara el reporte Softplan contra el inventario maestro PJ, se registran diferencias y solo se cierran cuando existe resolución sustentada.',
    result: 'Diferencias cerradas o conservadas como pendientes con responsable y plazo.',
    diagramId: '06',
  },
  {
    id: 'contingencia',
    title: 'Contingencia',
    trigger: 'La herramienta oficial no está disponible y existe canal alterno habilitado.',
    executiveMessage: 'Se usa un folio de contingencia, se conserva la trazabilidad de la transmisión y posteriormente se regulariza el ticket oficial.',
    result: 'Solicitud alterna vinculada al ticket regularizado y a la evidencia original.',
    diagramId: '17',
  },
]

const responsibilityRows = [
  ['Área usuaria', 'Sustenta la necesidad y confirma acceso o resultado cuando corresponde.'],
  ['Instancia de aceptación PJ', 'Verifica autorización y facultades antes de ejecutar la operación.'],
  ['Gestión de Servicios PJ', 'Registra, clasifica, controla inventario, reservas, temporalidad, conciliación, ANS y contingencias.'],
  ['Ejecutor técnico PJ habilitado', 'Ejecuta únicamente las operaciones para las que exista habilitación formal y técnica.'],
  ['Unidad administrativa PJ', 'Regulariza ampliaciones, sustento, facturación, conformidad y pago según aplique.'],
  ['Softplan', 'Valida solicitudes, ejecuta operaciones técnicas, registra gestión comercial y entrega evidencia.'],
]

const executiveControls = [
  { title: 'Autorización previa', detail: 'La operación no avanza sin respaldo suficiente y facultades aplicables.' },
  { title: 'Capacidad y reservas', detail: 'Se distingue disponibilidad, reutilización, provisión, ampliación y reserva vigente.' },
  { title: 'Ejecución habilitada', detail: 'Cada operación se ejecuta solo por el actor formalmente facultado y técnicamente habilitado.' },
  { title: 'Trazabilidad de estados', detail: 'Caso, solicitud, ticket, licencia, respuesta, estado y evidencia permanecen relacionados.' },
  { title: 'Seguimiento transversal', detail: 'ANS, temporalidad, reservas, conciliación y contingencias tienen controles específicos.' },
]

const indicators = [
  ['Atención dentro del ANS', 'Controla tiempo por etapa, pausas admitidas, alertas y escalamiento.'],
  ['Reservas pendientes', 'Identifica reservas sin ejecución, vencimiento o prórroga justificada.'],
  ['Licencias temporales', 'Controla términos, bajas programadas y reversiones pendientes.'],
  ['Diferencias de conciliación', 'Mantiene visibles las diferencias abiertas hasta contar con resolución sustentada.'],
  ['Contingencias por regularizar', 'Controla folios alternos todavía no vinculados al ticket oficial.'],
]

const operationGroups = [
  { title: 'Alta', items: ['ALTA', 'PROVISIÓN', 'AMPLIACIÓN'], detail: 'Asignación, provisión de capacidad contratada o incremento adicional.' },
  { title: 'Baja', items: ['BAJA / LIBERACIÓN'], detail: 'Retiro, desasociación o liberación de una licencia.' },
  { title: 'Modificación', items: ['MODIFICACIÓN', 'LIBERAR_ANTERIOR'], detail: 'Cambio de condición y liberación controlada de la licencia previa.' },
  { title: 'Conciliación', items: ['REPORTE', 'AJUSTE_INVENTARIO'], detail: 'Solicitud de información, aclaración o corrección de diferencias.' },
]

const licenseStateDetails: Record<string, string> = {
  DISPONIBLE: 'Licencia vigente y reutilizable, sin una asignación que impida atender una nueva necesidad.',
  RESERVADA: 'Licencia apartada temporalmente para una solicitud pendiente de ejecución o confirmación.',
  ASIGNADA: 'Asignación confirmada y vinculada al usuario o recurso correspondiente.',
  LIBERADA: 'Desasociación confirmada; todavía debe verificarse si queda disponible, vencida o cancelada.',
  SUSPENDIDA: 'Uso temporalmente suspendido, conservando la trazabilidad de la asignación y su causal.',
  VENCIDA: 'La vigencia terminó y la licencia no puede considerarse disponible para una nueva asignación.',
  CANCELADA: 'El derecho o capacidad fue cancelado y no puede reutilizarse.',
}

export function ExecutivePresentation({ onOpenDiagram, onOpenPending }: ExecutivePresentationProps) {
  const [activeStep, setActiveStep] = useState(journey[0])
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const [activeSummaryPanel, setActiveSummaryPanel] = useState<SummaryPanel | null>(null)
  const toggleSummaryPanel = (panel: SummaryPanel) => setActiveSummaryPanel((current) => current === panel ? null : panel)
  const activeStepDiagramId = activeStep.diagramId

  return (
    <section className="executive-page">
      <div className="executive-hero">
        <div className="executive-hero-copy">
<<<<<<< HEAD
          <span className="eyebrow">Vista gerencial · BPMN actualizado v0.6</span>
=======
          <span className="eyebrow">Vista gerencial · BPMN actualizado </span>
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94
          <h1>Gestión integral de licencias STEJENP</h1>
          <p>
            Lectura ejecutiva del procedimiento actualizado para entender decisiones, responsables, escenarios, controles transversales y trazabilidad sin recorrer todos los diagramas operativos.
          </p>
          <div className="executive-actions">
            <button className="primary-action" onClick={() => onOpenDiagram('n0')}><Workflow size={17} /> Ver BPMN integral</button>
            <button className="secondary-action" onClick={onOpenPending}><AlertTriangle size={17} /> Ver pendientes</button>
          </div>
        </div>
        <div className="executive-scoreboard">
<<<<<<< HEAD
          <button type="button" className={activeSummaryPanel === 'operations' ? 'scoreboard-action active' : 'scoreboard-action'} onClick={() => toggleSummaryPanel('operations')} aria-expanded={activeSummaryPanel === 'operations'} aria-controls="executive-summary-panel">
            <strong>{procedure.operationTypes.length}</strong><span>códigos de operación</span><ChevronDown className="scoreboard-chevron" size={18} />
          </button>
          <button type="button" className={activeSummaryPanel === 'states' ? 'scoreboard-action active' : 'scoreboard-action'} onClick={() => toggleSummaryPanel('states')} aria-expanded={activeSummaryPanel === 'states'} aria-controls="executive-summary-panel">
            <strong>{procedure.states.length}</strong><span>estados de licencia</span><ChevronDown className="scoreboard-chevron" size={18} />
          </button>
          <button type="button" className={activeSummaryPanel === 'diagrams' ? 'scoreboard-action active' : 'scoreboard-action'} onClick={() => toggleSummaryPanel('diagrams')} aria-expanded={activeSummaryPanel === 'diagrams'} aria-controls="executive-summary-panel">
            <strong>{diagrams.length}</strong><span>diagramas vinculados</span><ChevronDown className="scoreboard-chevron" size={18} />
          </button>
          <button type="button" className={activeSummaryPanel === 'controls' ? 'scoreboard-action active' : 'scoreboard-action'} onClick={() => toggleSummaryPanel('controls')} aria-expanded={activeSummaryPanel === 'controls'} aria-controls="executive-summary-panel">
            <strong>{executiveControls.length}</strong><span>controles transversales</span><ChevronDown className="scoreboard-chevron" size={18} />
          </button>
=======
          <div><strong>{procedure.operationTypes.length}</strong><span>tipos de operación</span></div>
          <div><strong>{procedure.states.length}</strong><span>estados de licencia</span></div>
          <div><strong>{diagrams.length}</strong><span>diagramas vinculados</span></div>
          <div><strong>{executiveControls.length}</strong><span>controles transversales</span></div>
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94
        </div>
      </div>

      {activeSummaryPanel && (
        <article id="executive-summary-panel" className="summary-detail-panel">
          {activeSummaryPanel === 'operations' && (
            <>
              <div className="summary-panel-heading">
                <Database size={19} />
                <div><h2>Mapa de códigos de operación</h2><p>Relación entre los escenarios del procedimiento y las operaciones técnicas que viajan en la solicitud PJ ↔ Softplan.</p></div>
              </div>
              <div className="summary-panel-grid four-columns">
                {operationGroups.map((group) => (
                  <div key={group.title} className="summary-panel-card">
                    <strong>{group.title}</strong>
                    <div className="summary-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                    <p>{group.detail}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSummaryPanel === 'states' && (
            <>
              <div className="summary-panel-heading">
                <Database size={19} />
                <div><h2>Estados de licencia</h2><p>Estados de control utilizados para conocer la condición real de cada licencia durante su ciclo de vida.</p></div>
              </div>
              <div className="summary-panel-grid state-grid">
                {procedure.states.map((state) => (
                  <div key={state} className="summary-panel-card">
                    <strong>{state}</strong>
                    <p>{licenseStateDetails[state] ?? 'Estado de control definido por el procedimiento.'}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSummaryPanel === 'diagrams' && (
            <>
              <div className="summary-panel-heading">
                <Layers3 size={19} />
                <div><h2>Diagramas vinculados</h2><p>Navega directamente por los niveles N0, N1 y N2 del procedimiento.</p></div>
              </div>
              <div className="diagram-summary-grid">
                {(['N0', 'N1', 'N2'] as const).map((level) => (
                  <div key={level} className="diagram-summary-group">
                    <strong>{level}</strong><span>{diagrams.filter((diagram) => diagram.level === level).length} diagramas</span>
                    <div>
                      {diagrams.filter((diagram) => diagram.level === level).map((diagram) => (
                        <button key={diagram.id} type="button" onClick={() => onOpenDiagram(diagram.id)}>{diagram.shortTitle}<ArrowRight size={13} /></button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSummaryPanel === 'controls' && (
            <>
              <div className="summary-panel-heading">
                <ClipboardCheck size={19} />
                <div><h2>Controles transversales</h2><p>Controles que aplican a lo largo del procedimiento y no dependen de una sola operación.</p></div>
              </div>
              <div className="summary-panel-grid controls-grid">
                {executiveControls.map((control) => (
                  <div key={control.title} className="summary-panel-card control-summary-card">
                    <CheckCircle2 size={16} /><div><strong>{control.title}</strong><p>{control.detail}</p></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </article>
      )}

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
            <div><Zap size={18} /><strong>Ejecución controlada</strong><span>PJ habilitado o Softplan ejecutan según facultad y operación</span></div>
            <ArrowRight size={18} />
            <div><Database size={18} /><strong>Inventario gobierna</strong><span>evita duplicidad, sobreuso y cierres sin sustento</span></div>
          </div>
        </article>

        <article className="executive-card executive-card-wide">
          <div className="executive-card-heading">
            <GitBranch size={20} />
            <div>
              <h2>Recorrido del proceso</h2>
              <p>Siete pasos de control. Selecciona uno para ver actor, decisión y salida esperada.</p>
            </div>
          </div>
          <div className="journey-layout">
            <div className="journey-rail">
              {journey.map((step) => (
                <button
                  key={step.id}
                  className={activeStep.id === step.id ? 'active' : ''}
                  onClick={() => setActiveStep(step)}
                >
                  <span>{step.title.split('.')[0]}</span>
                  <div style={{ minWidth: 0, textAlign: 'left' }}>
                    <strong style={{ display: 'block' }}>
                      {step.title.replace(/^\d\.\s*/, '')}
                    </strong>
                    <small
                      style={{
                        display: 'block',
                        marginTop: 4,
                        color: '#6f7e91',
                        fontSize: '11px',
                        lineHeight: 1.25,
                        whiteSpace: 'normal',
                      }}
                    >
                      {step.actor}
                    </small>
                  </div>
                </button>
              ))}
            </div>
            <div className="journey-detail">
              <h3>{activeStep.title}</h3>
              <p>{activeStep.description}</p>
              <div className="decision-box"><UsersRound size={17} /><div><strong>Actor responsable</strong><span>{activeStep.actor}</span></div></div>
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

        {/*<article className="executive-card">
          <div className="executive-card-heading"><RefreshCcw size={20} /><div><h2>Pendientes de formalización</h2><p>Temas que requieren decisión antes de versión operativa.</p></div></div>
          <div className="pending-mini-list">
            {pendingScenarios.slice(0, 3).map((item) => <div key={item.title}><AlertTriangle size={15} /><span>{item.title}</span></div>)}
          </div>
          <button className="link-action" onClick={onOpenPending}>Revisar todos <ArrowRight size={15} /></button>
        </article>*/}
      </div>

      <div className="executive-footer-note">
        <strong>Alcance:</strong> {procedure.scope}
      </div>
    </section>
  )
}
