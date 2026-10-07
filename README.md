# Presentación dinámica gerencial STEJENP · Gestión de licencias

Versión basada en **base estable v1.0** (`fix-lane-padre`) y evolucionada a una **vista gerencial compacta**.

## Enfoque

La aplicación mantiene el visor BPMN operativo, pero agrega una entrada principal para nivel gerencial:

- recorrido en 6 pasos del proceso;
- escenarios de negocio: alta, baja, modificación y conciliación;
- responsabilidades por actor;
- controles críticos;
- indicadores gerenciales;
- pendientes de formalización.

## Ejecutar

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Estructura relevante

- `src/components/ExecutivePresentation.tsx`: vista gerencial compacta.
- `src/components/BpmnViewer.tsx`: visor BPMN interactivo.
- `src/data/procedure.ts`: referencias funcionales, actividades y pendientes.
- `src/bpmn/*.bpmn`: diagramas BPMN originales.
