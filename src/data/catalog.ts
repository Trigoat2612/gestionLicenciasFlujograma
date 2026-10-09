export type Level = 'N0' | 'N1' | 'N2'

export type DiagramDefinition = {
  id: string
  level: Level
  title: string
  shortTitle: string
  fileKey: string
  description: string
  group: 'general' | 'pj' | 'softplan' | 'shared'
}

export const diagrams: DiagramDefinition[] = [
  {
    id: 'n0', level: 'N0', title: 'Gestión integral de licencias', shortTitle: 'Vista general',
    fileKey: 'n0.bpmn', group: 'general',
    description: 'Visión integral del proceso: operaciones PJ, atención Softplan, regularización, ANS, contingencias, conciliación, temporalidad y control de reservas.'
  },
  {
    id: '01', level: 'N1', title: 'Operaciones y autorización PJ', shortTitle: 'PJ: operaciones',
    fileKey: '01-operaciones-pj.bpmn', group: 'pj',
    description: 'Verifica autorización, registra el caso y clasifica la operación: alta, baja, modificación, suspensión/reactivación, carga masiva o consulta.'
  },
  {
    id: '02', level: 'N1', title: 'Atención y respuesta Softplan', shortTitle: 'Softplan: atención',
    fileKey: '02-atencion-softplan.bpmn', group: 'softplan',
    description: 'Valida la solicitud, resuelve la operación técnica y remite el resultado final con evidencia.'
  },
  {
    id: '03', level: 'N2', title: 'Alta y capacidad contratada', shortTitle: 'Alta',
    fileKey: '03-alta.bpmn', group: 'pj',
    description: 'Evalúa disponibilidad, provisión o ampliación, define quién ejecuta, confirma acceso y programa controles de reserva o temporalidad.'
  },
  {
    id: '04', level: 'N2', title: 'Baja y reutilización', shortTitle: 'Baja',
    fileKey: '04-baja.bpmn', group: 'pj',
    description: 'Gestiona la liberación, confirma la ejecución y clasifica la licencia como disponible, vencida o cancelada según corresponda.'
  },
  {
    id: '05', level: 'N2', title: 'Modificación y liberación anterior', shortTitle: 'Modificación',
    fileKey: '05-modificacion.bpmn', group: 'pj',
    description: 'Gestiona la nueva condición, la validación del acceso y la liberación segura de la licencia anterior, incluyendo ampliación y retiro previo por seguridad.'
  },
  {
    id: '06', level: 'N2', title: 'Conciliación periódica', shortTitle: 'Conciliación',
    fileKey: '06-conciliacion.bpmn', group: 'pj',
    description: 'Obtiene el reporte, concilia contra el inventario, trata diferencias, conserva pendientes y cierra únicamente con resolución sustentada.'
  },
  {
    id: '07', level: 'N2', title: 'Regularización administrativa PJ', shortTitle: 'Administrativa PJ',
    fileKey: '07-administrativa.bpmn', group: 'pj',
    description: 'Gestiona expediente, sustento, cobertura presupuestal, facturación, conformidad, pago y cierre administrativo de ampliaciones.'
  },
  {
    id: '08', level: 'N2', title: 'Intercambio común PJ–Softplan', shortTitle: 'Intercambio COM',
    fileKey: '08-intercambio-comun.bpmn', group: 'shared',
    description: 'Canal reutilizable para solicitud, subsanación, estados PENDIENTE/ATENDIDA/RECHAZADA/CANCELADA y contingencia cuando la herramienta no está disponible.'
  },
  {
    id: '09', level: 'N2', title: 'Validación y subsanación Softplan', shortTitle: 'Validación Softplan',
    fileKey: '09-validacion-softplan.bpmn', group: 'softplan',
    description: 'Valida emisor, datos y respaldos; comunica observaciones o rechazo cuando corresponda.'
  },
  {
    id: '10', level: 'N2', title: 'Ejecución técnica Softplan', shortTitle: 'Ejecución técnica',
    fileKey: '10-ejecucion-tecnica.bpmn', group: 'softplan',
    description: 'Evalúa viabilidad y ejecuta asignación, retiro, modificación, reporte, ajuste, suspensión o reactivación; documenta impedimentos y evidencia.'
  },
  {
    id: '11', level: 'N2', title: 'Registro comercial Softplan', shortTitle: 'Comercial Softplan',
    fileKey: '11-comercial.bpmn', group: 'softplan',
    description: 'Registra referencia comercial y autorización, concilia consumo y mantiene seguimiento hasta el cierre comercial.'
  },
  {
    id: '12', level: 'N2', title: 'Vigencia de licencias temporales', shortTitle: 'Temporales',
    fileKey: '12-vigencia-temporales.bpmn', group: 'pj',
    description: 'Controla la fecha de término de licencias temporales y ejecuta reversión, baja programada o escalamiento cuando no exista definición.'
  },
  {
    id: '13', level: 'N2', title: 'Control de reservas', shortTitle: 'Reservas',
    fileKey: '13-control-reservas.bpmn', group: 'pj',
    description: 'Revisa reservas sin ejecución, cancelaciones, prórrogas justificadas y retorno a DISPONIBLE con evidencia.'
  },
  {
    id: '14', level: 'N2', title: 'Cargas masivas y despliegue', shortTitle: 'Cargas masivas',
    fileKey: '14-cargas-masivas.bpmn', group: 'pj',
    description: 'Valida matrices, concilia capacidad, atiende filas del lote, controla reservas y consolida resultados e incidencias de despliegue.'
  },
  {
    id: '15', level: 'N2', title: 'Suspensión y reactivación', shortTitle: 'Suspensión / reactivación',
    fileKey: '15-suspension-reactivacion.bpmn', group: 'pj',
    description: 'Gestiona suspensión o reactivación autorizadas, valida vigencia y registra el estado resultante con evidencia.'
  },
  {
    id: '16', level: 'N2', title: 'Control de ANS y escalamiento', shortTitle: 'ANS y escalamiento',
    fileKey: '16-control-ans.bpmn', group: 'pj',
    description: 'Controla tiempos por etapa, alertas, bloqueos, vencimientos y escalamiento hacia Gestión de Servicios, Service Manager y Dirección.'
  },
  {
    id: '17', level: 'N2', title: 'Canal alterno y regularización de contingencia', shortTitle: 'Contingencia',
    fileKey: '17-contingencia.bpmn', group: 'shared',
    description: 'Gestiona atención por canal alterno, folio de contingencia y posterior regularización del ticket cuando la herramienta oficial vuelve a estar disponible.'
  },
]

export const callTargets: Record<string, string> = {
  PJ01: '01',
  PJ03: '07',
  PJ04: '17',
  PJ05: '16',
  PJ06: '06',
  PJ07: '12',
  PJ08: '13',
  SP00: '02',
  SP12: '11',
  AL: '03',
  BA: '04',
  MO: '05',
  SU: '15',
  LT: '14',
  QU: '08',
  SV: '09',
  ST: '10',
  AL06: '08',
  BA02: '08',
  LT04: '08',
  LT06: '01',
  CO01: '08',
  CO04: '08',
  COM00: '17',
  MO13: '04',
  MO06: '08',
  MO09: '08',
  SU02: '08',
  SU04: '08',
  TM03: '05',
  TM04: '04',
}

// Las asociaciones de llamadas BPMN están normalizadas en los archivos incluidos en esta versión.
export const nativeAssociationExceptions = new Set<string>()

export const levelLabels: Record<Level, string> = {
  N0: 'Nivel 0 · visión integral',
  N1: 'Nivel 1 · coordinación',
  N2: 'Nivel 2 · detalle operativo',
}
