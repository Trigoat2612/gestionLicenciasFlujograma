export const procedure = {
  title: 'Procedimiento de gestión integral de licencias STEJENP',
<<<<<<< HEAD
  version: 'Modelo BPMN v0.6 · Proyecto v2.2.2',
=======
  version: 'Modelo BPMN v0.6 · Proyecto v2.2.0',
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94
  date: '8 de octubre de 2026',
  objective: 'Gestionar el ciclo de licencias STEJENP con autorización previa, control de capacidad, ejecución trazable, seguimiento de estados, conciliación y regularización administrativa cuando corresponda.',
  scope: 'La vista integra las operaciones del Poder Judicial y Softplan, incluyendo alta, baja, modificación, suspensión/reactivación, cargas masivas, consultas, controles de reservas y temporalidad, ANS, conciliación y contingencias.',
  principles: [
    'Autorización previa',
    'Control de capacidad y reservas',
    'Ejecución solo por actor habilitado',
    'Continuidad y control de temporalidad',
    'Trazabilidad del caso y de cada solicitud',
    'Cierres técnico, administrativo y comercial diferenciados',
  ],
  states: ['DISPONIBLE', 'RESERVADA', 'ASIGNADA', 'LIBERADA', 'SUSPENDIDA', 'VENCIDA', 'CANCELADA'],
  operationTypes: [
    'ALTA / ASIGNACION',
    'BAJA / LIBERACION',
    'MODIFICACION',
    'SUSPENDER / REACTIVAR',
    'CARGA_MASIVA',
    'CONSULTA / CONFIRMACION',
    'PROVISION / AMPLIACION',
    'REPORTE / AJUSTE_INVENTARIO',
  ],
}

export type ActivityReference = {
  responsible?: string
  evidence?: string
  note?: string
}

// Referencias complementarias para las actividades principales. El detalle operativo
// se obtiene directamente del carril y de la documentación embebida en cada BPMN.
export const activityReference: Record<string, ActivityReference> = {
  PJ01: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado, estado y evidencia de la operación vinculados al idCaso y a su idSolicitud.' },
  PJ03: { responsible: 'Unidad administrativa o contractual PJ', evidence: 'Expediente administrativo y estado de regularización vinculados a la ampliación.' },
  PJ04: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Folio de contingencia vinculado al ticket regularizado y a los mensajes originales.' },
  PJ05: { responsible: 'Gestión de Servicios / Dirección Ejecutiva PJ', evidence: 'Hitos, pausas admitidas, alertas y escalaciones registradas.' },
  PJ06: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Reporte conciliado, diferencias, ajustes y pendientes con fecha de corte.' },
  PJ07: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado de prórroga, baja o reversión de la licencia temporal con evidencia.' },
  PJ08: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Reserva verificada, prorrogada o liberada con nueva fecha y evidencia.' },
  SP00: { responsible: 'Mesa de Servicios / Ejecutor técnico Softplan', evidence: 'Resultado final de validación y ejecución con evidencia.' },
  SP12: { responsible: 'Gestión comercial Softplan', evidence: 'Referencia comercial, consumo conciliado y seguimiento de cierre.' },

  IN01: { responsible: 'Instancia de aceptación PJ', evidence: 'Autorización y facultades aplicables verificadas.' },
  IN02: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Caso, prioridad, usuario y licencia registrados.' },
  IN05: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Seguimiento independiente programado para pendientes y controles.' },

  AL: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado del detalle 03 Alta y capacidad contratada.' },
  BA: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado del detalle 04 Baja y reutilización.' },
  MO: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado del detalle 05 Modificación y liberación anterior.' },
  SU: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado del detalle 15 Suspensión y reactivación.' },
  LT: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado del detalle 14 Cargas masivas y despliegue.' },
  QU: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Consulta o confirmación tramitada sin modificar capacidad ni asignación.' },

  AL06: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado y evidencia de ALTA, PROVISION o AMPLIACION obtenidos mediante el intercambio común.' },
  BA02: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Resultado y evidencia de BAJA o LIBERACION obtenidos mediante el intercambio común.' },
  MO06: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Nueva condición gestionada con resultado y evidencia.' },
  MO09: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Liberación de licencia anterior gestionada con evidencia de validación previa.' },
  SU02: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Suspensión autorizada gestionada preservando la historia.' },
  SU04: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Reactivación autorizada gestionada sobre licencia vigente.' },
  LT04: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Provisión o ampliación del lote confirmada antes de atender las filas.' },
  LT06: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Fila del lote atendida individualmente con idSolicitud e idempotencia de reserva.' },
  CO01: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Reporte de licencias solicitado con alcance y fecha de corte.' },
  CO04: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Ajuste de inventario solicitado con diferencias, evidencia y autorización.' },
  COM00: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Canal alterno preparado con criticidad, autorización y medio acordado.' },
  TM03: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Reversión temporal autorizada ejecutada mediante modificación.' },
  TM04: { responsible: 'Gestión de Servicios o administrador de licencias PJ', evidence: 'Baja programada o expiración verificada mediante el flujo de baja.' },

  SV: { responsible: 'Mesa de Servicios Softplan', evidence: 'Emisor, datos y respaldos validados; observación o rechazo comunicado cuando corresponde.' },
  ST: { responsible: 'Ejecutor técnico Softplan', evidence: 'Resultado técnico y evidencia de la operación solicitada.' },
  SP07: { responsible: 'Ejecutor técnico Softplan', evidence: 'Resultado final y evidencia. ATENDIDA acredita ejecución o consulta; RECHAZADA/CANCELADA conservan causa y PENDIENTE no acredita ejecución.' },
}

export const pendingScenarios = [
  {
    title: 'Periodicidad de conciliación',
    detail: 'El flujo ya registra la próxima conciliación, pero el valor de la periodicidad debe aprobarse y parametrizarse antes de automatizar su ejecución.',
    solution: 'Definir la periodicidad como parámetro operativo, no como una fecha fija embebida en el BPMN.',
    steps: [
      'Aprobar la periodicidad aplicable por el responsable del procedimiento.',
      'Registrar PERIODICIDAD_CONCILIACION como parámetro configurable.',
      'Guardar fecha de corte, fecha de ejecución, próxima fecha, responsable y resultado.',
      'Hacer que PJ09 calcule la próxima fecha usando el parámetro aprobado.',
      'Definir el tratamiento de una conciliación vencida y su escalamiento mediante el control ANS.'
    ]
  },
  {
    title: 'Vigencia y prórroga de reservas',
    detail: 'El BPMN controla reservas sin ejecución, pero la vigencia máxima y las reglas de prórroga todavía requieren formalización.',
    solution: 'Administrar la reserva mediante parámetros de vigencia y número máximo de prórrogas, conservando evidencia de cada cambio.',
    steps: [
      'Aprobar VIGENCIA_MAX_RESERVA y MAX_PRORROGAS_RESERVA.',
      'Registrar fecha de reserva, fecha de vencimiento, idSolicitud y justificación.',
      'Validar en RV02 si existe ejecución confirmada antes de liberar una reserva.',
      'Si corresponde prórroga, registrar nueva fecha y sustento en RV03.',
      'Si no existe sustento, cambiar a DISPONIBLE en RV04 y conservar evidencia.'
    ]
  },
  {
    title: 'Canal alterno y regularización de contingencia',
    detail: 'El flujo de contingencia existe, pero deben aprobarse los canales alternos, actores autorizados y plazo de regularización del ticket oficial.',
    solution: 'Definir un catálogo de canales de contingencia y asegurar la correlación entre el folio alterno y el ticket oficial.',
    steps: [
      'Aprobar CANAL_OFICIAL, canales alternos permitidos y actores autorizados.',
      'Definir el plazo máximo de regularización una vez restablecida la herramienta oficial.',
      'Generar un folio de contingencia con idCaso, operación, usuario/recurso, licencia, fecha y autorización.',
      'Al restablecerse el canal oficial, crear el ticket y vincular folio_contingencia ↔ ticket_oficial.',
      'Escalar automáticamente los casos que excedan el plazo formalizado.'
    ]
  },
  {
    title: 'Matriz de habilitación técnica PJ / Softplan',
    detail: 'Alta, baja y modificación preguntan si el PJ está facultado y técnicamente habilitado. Esa condición debe basarse en una regla objetiva y vigente.',
    solution: 'Aprobar una matriz que indique, por operación y ambiente, quién puede ejecutar y qué evidencia debe dejar.',
    steps: [
      'Listar cada operación técnica y los ambientes donde puede ejecutarse.',
      'Definir si corresponde ejecución PJ, Softplan o ambos bajo condiciones específicas.',
      'Asignar responsables nominales, perfiles y privilegios habilitados.',
      'Definir evidencia mínima, validación posterior y procedimiento de reversión.',
      'Referenciar la matriz en los gateways que preguntan por facultad y habilitación técnica.'
    ]
  },
  {
    title: 'Catálogo de escalaciones BPMN',
    detail: 'El N0 recibe ampliación, contingencia y seguimiento ANS desde ramas distintas. Conviene formalizar eventos diferenciados para evitar una correlación ambigua.',
    solution: 'Asignar una escalación distinta a cada propósito y hacer que cada boundary event escuche únicamente su evento correspondiente.',
    steps: [
      'Definir códigos diferenciados, por ejemplo ESC_AMPLIACION_PJ, ESC_CONTINGENCIA y ESC_AMPLIACION_SOFTPLAN.',
      'Asignar la escalación correcta a los eventos de lanzamiento de cada N2.',
      'Configurar en N0 los boundary events receptores con la escalación correspondiente.',
      'Exportar nuevamente y verificar que cada evento incluya su escalationRef.',
      'Documentar el catálogo junto con la matriz de correlación entre niveles.'
    ]
  },
  {
    title: 'ANS, ANO y reglas de escalamiento',
    detail: 'El flujo de control de ANS ya contempla hitos y escalamiento, pero los tiempos, pausas y umbrales deben quedar aprobados como parámetros operativos.',
    solution: 'Parametrizar los niveles de servicio y separar claramente el tiempo atribuible al PJ del tiempo atribuible al proveedor.',
    steps: [
      'Aprobar ANS por operación y ANO por etapa interna PJ.',
      'Definir horario aplicable y causas válidas de suspensión del cómputo.',
      'Formalizar el umbral de alerta preventiva como parámetro configurable.',
      'Asignar responsables y niveles de escalamiento: Gestión de Servicios, Service Manager y Dirección.',
      'Registrar en cada caso hitos, pausas, reanudaciones, vencimiento y evidencia del escalamiento.'
    ]
  },
]
