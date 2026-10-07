export const procedure = {
  title: 'Procedimiento de gestión integral de licencias STEJENP',
  version: 'Propuesta v0.2',
  date: '7 de octubre de 2026',
  objective: 'Asignar, provisionar, ampliar, liberar, modificar y conciliar licencias de la STEJENP, asegurando autorización, control de capacidad y trazabilidad técnica y administrativa.',
  scope: 'Aplica a las licencias vinculadas a la STEJENP para las especialidades Laboral, Civil, Familia y Justicia de Género, según el alcance contratado y desplegado.',
  principles: [
    'Autorización previa',
    'Control de capacidad',
    'Responsabilidades diferenciadas',
    'Continuidad de acceso',
    'Trazabilidad',
    'Cierres diferenciados',
  ],
  states: ['DISPONIBLE', 'RESERVADA', 'ASIGNADA', 'LIBERADA', 'VENCIDA', 'CANCELADA'],
  operationTypes: ['ALTA', 'PROVISION', 'AMPLIACION', 'BAJA / LIBERACION', 'MODIFICACION', 'LIBERAR_ANTERIOR', 'REPORTE', 'AJUSTE_INVENTARIO'],
}

export type ActivityReference = {
  responsible?: string
  evidence?: string
  note?: string
}

export const activityReference: Record<string, ActivityReference> = {
  PJ01: { responsible: 'Gestión de Servicios PJ', evidence: 'Caso atendido mediante el detalle 01 y sus ramas AL, BA o MO.' },
  PJ03: { responsible: 'Unidad administrativa PJ', evidence: 'Regularización tramitada mediante el detalle 07.' },
  SP00: { responsible: 'Mesa de Servicios Softplan', evidence: 'Solicitud validada y operación resuelta mediante el detalle 02.' },
  SP12: { responsible: 'Gestión comercial Softplan', evidence: 'Referencia comercial registrada mediante el detalle 11.' },
  IN01: { responsible: 'Instancia de aceptación', evidence: 'Respaldo de aceptación o preaceptación verificado.' },
  IN02: { responsible: 'Gestión de Servicios PJ', evidence: 'Requerimiento con usuario o recurso, licencia y operación identificados.' },
  AL: { responsible: 'Gestión de Servicios PJ', evidence: 'Resultado del detalle 03 Alta.' },
  BA: { responsible: 'Gestión de Servicios PJ', evidence: 'Resultado del detalle 04 Baja.' },
  MO: { responsible: 'Gestión de Servicios PJ', evidence: 'Resultado del detalle 05 Modificación.' },
  AL01: { responsible: 'Gestión de Servicios PJ', evidence: 'Tipo de licencia y temporalidad definidos.' },
  AL02: { responsible: 'Gestión de Servicios PJ', evidence: 'Consulta del inventario y disponibilidad sustentada.' },
  AL03: { responsible: 'Gestión de Servicios PJ', evidence: 'Reserva vinculada a la solicitud.' },
  AL04: { responsible: 'Gestión de Servicios PJ', evidence: 'Solicitud de provisión con capacidad contratada identificada.' },
  AL05: { responsible: 'Gestión de Servicios PJ', evidence: 'Autorización de ampliación y mecanismo contractual registrados.' },
  AL06: { responsible: 'Gestión de Servicios PJ', evidence: 'Resultado atendido y evidencia obtenidos a través de COM.' },
  AL08: { responsible: 'Gestión de Servicios PJ', evidence: 'Licencia ASIGNADA vinculada al usuario o recurso y a la evidencia.' },
  AL09: { responsible: 'Área usuaria', evidence: 'Confirmación del acceso o atención por el área usuaria.' },
  BA01: { responsible: 'Gestión de Servicios PJ', evidence: 'Licencia asociada y prioridad identificadas.' },
  BA02: { responsible: 'Gestión de Servicios PJ', evidence: 'Desactivación o desasociación confirmada mediante COM.' },
  BA04: { responsible: 'Gestión de Servicios PJ', evidence: 'Liberación registrada y condiciones de reutilización verificadas.' },
  BA05: { responsible: 'Gestión de Servicios PJ', evidence: 'Estado DISPONIBLE cuando la licencia sea reutilizable.' },
  BA06: { responsible: 'Gestión de Servicios PJ', evidence: 'Estado VENCIDA o CANCELADA, según el sustento.' },
  MO01: { responsible: 'Gestión de Servicios PJ', evidence: 'Evaluación del impacto de la modificación en la licencia.' },
  MO02: { responsible: 'Gestión de Servicios PJ', evidence: 'Registro del cambio sin impacto en licencia.' },
  MO03: { responsible: 'Gestión de Servicios PJ', evidence: 'Nueva licencia identificada y consulta de inventario.' },
  MO04: { responsible: 'Gestión de Servicios PJ', evidence: 'Reserva de nueva licencia vinculada al caso.' },
  MO05: { responsible: 'Gestión de Servicios PJ', evidence: 'Solicitud preparada con provisión o ampliación y su respaldo.' },
  MO06: { responsible: 'Gestión de Servicios PJ', evidence: 'Nueva asignación o reasignación confirmada mediante COM.' },
  MO08: { responsible: 'Área usuaria', evidence: 'Validación del acceso bajo la nueva condición por el área usuaria.' },
  MO09: { responsible: 'Gestión de Servicios PJ', evidence: 'Liberación anterior confirmada mediante una nueva invocación de COM.' },
  MO10: { responsible: 'Gestión de Servicios PJ', evidence: 'Inventario actualizado con nueva asignación y tratamiento de la licencia anterior.' },
  CO01: { responsible: 'Gestión de Servicios PJ', evidence: 'Reporte de licencias obtenido mediante COM.' },
  CO02: { responsible: 'Gestión de Servicios PJ', evidence: 'Comparación entre reporte Softplan e inventario maestro PJ.' },
  CO03: { responsible: 'Gestión de Servicios PJ', evidence: 'Diferencias registradas con evidencia, responsable y plazo.' },
  CO04: { responsible: 'Gestión de Servicios PJ', evidence: 'Ajuste o aclaración obtenido mediante COM.' },
  CO05: { responsible: 'Gestión de Servicios PJ', evidence: 'Inventario actualizado y diferencias cerradas con evidencia.' },
  COM01: { responsible: 'Gestión de Servicios PJ', evidence: 'Solicitud enviada con su operación, identificación y respaldo.' },
  COM03: { responsible: 'Gestión de Servicios PJ', evidence: 'Información corregida o completada y sustento de la subsanación.' },
  COM04: { responsible: 'Gestión de Servicios PJ', evidence: 'Subsanación remitida con el mismo identificador de solicitud.' },
  SV: { responsible: 'Mesa de Servicios Softplan', evidence: 'Resultado de validación del detalle 09.' },
  SP01: { responsible: 'Mesa de Servicios Softplan', evidence: 'Ticket registrado y datos mínimos verificados; en una subsanación se actualiza el mismo ticket.' },
  SP02: { responsible: 'Mesa de Servicios Softplan', evidence: 'Observaciones o datos faltantes comunicados al PJ.' },
  ST: { responsible: 'Ejecutor técnico Softplan', evidence: 'Resultado técnico del detalle 10.' },
  SP03: { responsible: 'Ejecutor técnico Softplan', evidence: 'Provisión, asignación o activación autorizada, con identificación de la licencia.' },
  SP04: { responsible: 'Ejecutor técnico Softplan', evidence: 'Desactivación o desasociación confirmada, preservando la trazabilidad.' },
  SP05: { responsible: 'Ejecutor técnico Softplan', evidence: 'Nueva asignación o reasignación aplicada.' },
  SP06: { responsible: 'Ejecutor técnico Softplan', evidence: 'Liberación de la licencia anterior sustentada en la validación PJ.' },
  SP08: { responsible: 'Mesa de Servicios Softplan', evidence: 'Reporte técnico de licencias preparado.' },
  SP09: { responsible: 'Ejecutor técnico Softplan', evidence: 'Análisis y ajuste o confirmación del registro, con evidencia.' },
  SP10: { responsible: 'Mesa de Servicios Softplan', evidence: 'Aclaración o confirmación de ajuste preparada.' },
  SP07: { responsible: 'Ejecutor técnico Softplan', evidence: 'Respuesta ATENDIDA enviada con operación, resultado, identificación y evidencia.' },
  AD01: { responsible: 'Unidad administrativa PJ', evidence: 'Expediente o registro de regularización iniciado y vinculado a la ampliación.' },
  AD02: { responsible: 'Unidad administrativa PJ', evidence: 'Regularización concluida y documentos de facturación, conformidad o pago, según corresponda.' },
  SP11: { responsible: 'Gestión comercial Softplan', evidence: 'Referencia comercial o contractual registrada y vinculada al caso de ampliación.' },
}

export const pendingScenarios = [
  {
    title: 'Ampliación en modificación',
    detail: 'MO05 admite provisión o ampliación, pero el recorrido de modificación no explicita la activación de AD01 y SP11 cuando el cambio requiere capacidad adicional.'
  },
  {
    title: 'Licencia anterior no reutilizable',
    detail: 'MO10 muestra la licencia anterior como DISPONIBLE; falta formalizar la alternativa VENCIDA o CANCELADA cuando no corresponda reutilización.'
  },
  {
    title: 'Respuesta distinta de observada o atendida',
    detail: 'El flujo COM solo distingue OBSERVADA y ATENDIDA; queda por acordar el tratamiento de rechazo definitivo, imposibilidad técnica o cancelación.'
  },
  {
    title: 'Validación de acceso no satisfactoria',
    detail: 'AL09 y MO08 no tienen una alternativa de fallo dibujada. En modificación, la licencia anterior no debe liberarse mientras no se confirme la nueva condición.'
  },
  {
    title: 'Programación y automatización',
    detail: 'La conciliación no expresa una frecuencia; si se automatiza, debe configurarse la correlación de mensajes, tipos de operación y escalaciones entre niveles.'
  },
]
