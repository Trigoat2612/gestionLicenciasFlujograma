# Presentación dinámica · Gestión de Licencias STEJENP

Aplicación web interactiva basada en los 12 diagramas BPMN del procedimiento de gestión integral de licencias STEJENP.

## Stack

- React 19 + TypeScript
- Vite
- `bpmn-js` para visualizar los archivos BPMN sin convertirlos a imágenes
- CSS responsive sin dependencia de un framework visual

## Funciones incluidas

- Navegación por niveles N0, N1 y N2.
- Visualización interactiva de los 12 BPMN originales.
- Zoom, paneo y ajuste del diagrama.
- Clic sobre actividades, eventos y compuertas para ver detalle.
- Responsable y evidencia esperada por código de actividad.
- Navegación de actividades de llamada hacia sus subprocesos.
- Señalización de las asociaciones BA, MO y MO09 que el procedimiento identifica, pero que no vienen enlazadas nativamente en los BPMN exportados.
- Búsqueda transversal por código, actividad, responsable o nombre de diagrama.
- Vista resumen del procedimiento.
- Vista separada de aspectos pendientes de formalización.
- Modo pantalla completa para exposición.
- Diseño responsive para escritorio, tablet y móvil.

## Ejecutar

```bash
npm install
npm run dev
```

Producción:

```bash
npm run build
npm run preview
```

## Actualización de BPMN

Los archivos están en `src/bpmn/`.

Para actualizar un flujo conservando la presentación:

1. Exporta el nuevo BPMN desde Bizagi.
2. Reemplaza el archivo correspondiente manteniendo su nombre normalizado.
3. Ejecuta `npm run build`.

El visor y el listado de actividades se generan directamente desde el XML BPMN. Por ello, los cambios de actividades, eventos, carriles y secuencias se reflejan sin redibujar la presentación.

## Actualización de metadatos del procedimiento

- `src/data/catalog.ts`: nombres, niveles, descripciones y asociaciones entre diagramas.
- `src/data/procedure.ts`: objetivo, alcance, principios, estados, evidencias y puntos pendientes de formalización.

Esta separación evita codificar el contenido dentro de los componentes visuales.

## Despliegue en Vercel

Framework preset: **Vite**

- Build command: `npm run build`
- Output directory: `dist`

No requiere backend ni base de datos para esta versión.
