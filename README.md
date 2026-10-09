# Gestión integral de licencias STEJENP · Presentación dinámica

Versión **2.2.0** de la presentación web gerencial/operativa del procedimiento de gestión de licencias STEJENP.

## Cambios de v2.2.0

### Visor BPMN

- Los lanes hijos se alinean usando los límites del `participant` padre, evitando el descuadre causado por los márgenes internos exportados por Bizagi.
- Las columnas de cabecera del participant y del lane ya no se solapan.
- Cuando una actividad concentra tres o más boundary events, el visor compacta sus marcadores y oculta únicamente sus rótulos en la vista general. El nombre completo sigue disponible al seleccionar el evento en el panel de detalle.
- `CO01` y `CO04` del diagrama de conciliación incluyen `calledElement` hacia el proceso común 08.

### Formalización

La sección **Por formalizar** se actualizó con seis temas vigentes:

1. Periodicidad de conciliación.
2. Vigencia y prórroga de reservas.
3. Canal alterno y regularización de contingencia.
4. Matriz de habilitación técnica PJ / Softplan.
5. Catálogo de escalaciones BPMN.
6. ANS, ANO y reglas de escalamiento.

Cada tarjeta contiene el problema, la solución propuesta y el paso a paso sugerido. Los valores concretos (plazos, periodicidad, umbrales, responsables nominales) siguen siendo decisiones que deben aprobarse; el proyecto no los presenta como ya formalizados.

## Ejecutar localmente

```bash
npm ci
npm run dev
```

## Validar build

```bash
npm run build
```

## Despliegue en Vercel

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command recomendado: `npm ci`

No requiere variables de entorno.

## Actualizar BPMN

Los diagramas están en `src/bpmn/`. Si se reemplaza un BPMN manteniendo su clave de archivo, el visor lo carga automáticamente. Si se incorpora un nuevo diagrama, agregar su registro en `src/data/catalog.ts` y, si aplica, su código de actividad de llamada en `callTargets`.

## Arquitectura funcional

- `src/components/ExecutivePresentation.tsx`: vista resumida gerencial.
- `src/components/BpmnViewer.tsx`: visor BPMN interactivo.
- `src/components/DetailPanel.tsx`: detalle de actividad, responsable, documentación y navegación.
- `src/data/catalog.ts`: catálogo de diagramas y asociaciones entre niveles.
- `src/data/procedure.ts`: contenido resumido, referencias complementarias y temas por formalizar.
- `src/bpmn/`: fuentes BPMN.
