<<<<<<< HEAD
# Validación · gestionLicenciasFlujograma v2.2.1

## Cambios aplicados

- Se agregó un panel desplegable **Mapa de códigos de operación** en la vista gerencial.
- El indicador ahora muestra **8 códigos de operación** en lugar de **8 tipos de operación**.
- El panel agrupa los códigos en Alta, Baja, Modificación y Conciliación.
- Se mantuvo visible **Pendientes de formalización**.

## Archivos modificados

- `src/components/ExecutivePresentation.tsx`
- `src/styles.css`
- `package.json`
- `package-lock.json`
- `README.md`
- `VERSION_BASE.md`
- `VALIDACION.md`

## Validación realizada

- Revisión de sintaxis JSX/TSX por inspección estructural.
- Revisión de referencias de estado `showOperationPanel`.
- Revisión de estilos responsive del nuevo panel.

## Validación pendiente

No se ejecutó `npm run build` porque el entorno no cuenta con `node_modules` y la instalación de dependencias depende del acceso al registro npm. Validar en local o Vercel con:

```bash
npm ci
npm run build
```
=======
# Validación v2.2.0

Fecha: 8 de octubre de 2026
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94

## Correcciones aplicadas

<<<<<<< HEAD
## Validación adicional
- Se verificó sintaxis TSX de `ExecutivePresentation.tsx` mediante TypeScript `transpileModule`: sin errores de sintaxis.
- Los cuatro recuadros de resumen usan el mismo patrón interactivo y `aria-expanded`.
- El detalle se muestra en un único panel alineado al contenedor principal y responde a tablet/móvil.
=======
- Los lanes hijos se recalculan a partir de los límites del `participant` padre. Todos los lanes de un mismo pool comparten el mismo inicio y el mismo borde derecho en la vista web.
- Las cabeceras HTML de participant y lane usan exactamente el ancho reservado en la geometría, evitando solapamientos.
- Los boundary events de actividades con tres o más controles se compactan solo para visualización: el círculo se reduce ligeramente y el rótulo se oculta en la vista general. El nombre original se conserva en el XML fuente y en el panel de detalle.
- `CO01` y `CO04` en `06-conciliacion.bpmn` incluyen `calledElement="Id_2248e1e8-40f2-42ee-9c46-8dc6074c280d"`, correspondiente al proceso Poder Judicial del detalle 08 Intercambio común.
- Se eliminó la excepción técnica que trataba CO01/CO04 como asociaciones no nativas.
- La sección `Por formalizar` contiene seis temas vigentes con solución propuesta y pasos detallados.

## Validaciones ejecutadas

- 18 archivos BPMN encontrados.
- 18/18 BPMN son XML bien formado.
- `catalog.ts` referencia exactamente los 18 archivos presentes en `src/bpmn/`.
- El destino `calledElement` de CO01 y CO04 existe en `08-intercambio-comun.bpmn` y corresponde al proceso `Poder Judicial`.
- Verificación geométrica del N0: todos los lanes hijos de cada participant calculan el mismo borde derecho que su pool padre después de aplicar las columnas de cabecera.
- Validación TypeScript estricta de la aplicación realizada con stubs locales de dependencias: **OK**.

## Build con dependencias reales

Se intentó `npm ci` en el entorno de ejecución. La descarga de dependencias agotó el tiempo disponible y dejó una instalación incompleta; por ello un `npm run build` posterior reportó tipos de dependencias faltantes. No se trata de un error TypeScript detectado en el código de la v2.2.0.

En Vercel o en una máquina con acceso normal al registro npm ejecutar:

```bash
npm ci
npm run build
```

El proyecto incluye `package-lock.json` y `vercel.json`.
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94
