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
    description: 'Coordinación general entre el Poder Judicial y Softplan; articula la atención técnica y, cuando corresponde, la regularización administrativa y comercial.'
  },
  {
    id: '01', level: 'N1', title: 'Detalle PJ', shortTitle: 'PJ: clasificación',
    fileKey: '01-detalle-pj.bpmn', group: 'pj',
    description: 'Aceptación, registro y clasificación del requerimiento en alta, baja o modificación.'
  },
  {
    id: '02', level: 'N1', title: 'Detalle Softplan', shortTitle: 'Softplan: atención',
    fileKey: '02-detalle-softplan.bpmn', group: 'softplan',
    description: 'Validación de la solicitud, resolución técnica de la operación y remisión de la respuesta atendida.'
  },
  {
    id: '03', level: 'N2', title: 'Alta y asignación', shortTitle: 'Alta',
    fileKey: '03-alta.bpmn', group: 'pj',
    description: 'Disponibilidad, provisión de capacidad contratada o ampliación; asignación y confirmación del acceso.'
  },
  {
    id: '04', level: 'N2', title: 'Baja y liberación', shortTitle: 'Baja',
    fileKey: '04-baja.bpmn', group: 'pj',
    description: 'Liberación de la licencia y decisión sobre su reutilización, vencimiento o cancelación.'
  },
  {
    id: '05', level: 'N2', title: 'Modificación y liberación anterior', shortTitle: 'Modificación',
    fileKey: '05-modificacion.bpmn', group: 'pj',
    description: 'Evalúa el impacto de licencia, valida la nueva condición y libera la licencia anterior solo después de confirmar el nuevo acceso.'
  },
  {
    id: '06', level: 'N2', title: 'Conciliación periódica', shortTitle: 'Conciliación',
    fileKey: '06-conciliacion.bpmn', group: 'pj',
    description: 'Proceso independiente de reporte, comparación, registro de diferencias, ajuste y cierre con evidencia.'
  },
  {
    id: '07', level: 'N2', title: 'Regularización administrativa PJ', shortTitle: 'Administrativa PJ',
    fileKey: '07-administrativa.bpmn', group: 'pj',
    description: 'Regularización administrativa o contractual, incluyendo facturación, conformidad o pago cuando corresponda.'
  },
  {
    id: '08', level: 'N2', title: 'Intercambio común PJ', shortTitle: 'Intercambio COM',
    fileKey: '08-intercambio-comun.bpmn', group: 'shared',
    description: 'Subproceso reutilizable para enviar solicitudes, recibir respuestas y subsanar observaciones conservando el mismo caso.'
  },
  {
    id: '09', level: 'N2', title: 'Validación y subsanación Softplan', shortTitle: 'Validación Softplan',
    fileKey: '09-validacion-softplan.bpmn', group: 'softplan',
    description: 'Registro del ticket, validación de datos mínimos, observación y revalidación de la subsanación del mismo caso.'
  },
  {
    id: '10', level: 'N2', title: 'Atención técnica Softplan', shortTitle: 'Atención técnica',
    fileKey: '10-atencion-tecnica.bpmn', group: 'softplan',
    description: 'Resuelve la operación técnica solicitada: asignación, baja, modificación, liberación anterior, reporte o ajuste.'
  },
  {
    id: '11', level: 'N2', title: 'Registro comercial Softplan', shortTitle: 'Comercial Softplan',
    fileKey: '11-comercial.bpmn', group: 'softplan',
    description: 'Registra la referencia comercial o contractual cuando existe una ampliación.'
  },
]

export const callTargets: Record<string, string> = {
  PJ01: '01',
  PJ03: '07',
  SP00: '02',
  SP12: '11',
  AL: '03',
  BA: '04',
  MO: '05',
  SV: '09',
  ST: '10',
  AL06: '08',
  BA02: '08',
  MO06: '08',
  MO09: '08',
  CO01: '08',
  CO04: '08',
}

export const nativeAssociationExceptions = new Set(['BA', 'MO', 'MO09'])

export const levelLabels: Record<Level, string> = {
  N0: 'Nivel 0 · visión integral',
  N1: 'Nivel 1 · coordinación',
  N2: 'Nivel 2 · detalle operativo',
}
