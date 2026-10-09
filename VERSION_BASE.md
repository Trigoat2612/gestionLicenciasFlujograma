<<<<<<< HEAD
# Versión base

## gestionLicenciasFlujograma v2.2.1 · Operation Map Panel
=======
# Versiones del proyecto

## Base visual estable

La base visual/funcional se mantiene sobre la versión que resolvió la visualización jerárquica de participantes y lanes:
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94

Base previa: v2.2.0 · Visual Alignment & Formalization Update.

<<<<<<< HEAD
Cambios de esta versión:

- Renombra el indicador gerencial de **tipos de operación** a **códigos de operación**.
- Convierte el indicador en un botón desplegable.
- Agrega un panel ejecutivo para identificar las operaciones por escenario:
  - Alta: ALTA, PROVISIÓN, AMPLIACIÓN.
  - Baja: BAJA / LIBERACIÓN.
  - Modificación: MODIFICACIÓN, LIBERAR_ANTERIOR.
  - Conciliación: REPORTE, AJUSTE_INVENTARIO.
- Mantiene visible el panel **Pendientes de formalización**.
- No cambia la lógica BPMN ni los archivos BPMN fuente.


## 2.2.2
Mejora de la portada gerencial: indicadores interactivos con paneles desplegables alineados y navegación contextual.
=======
## Versión actual

**v2.2.0 · Visual Alignment & Formalization Update**

Parte del modelo BPMN v0.6 y de la v2.1.0.

Cambios principales:

- Alineación de todos los lanes hijos contra los límites del participant/pool padre.
- Cabeceras padre/hijo con anchos exactos, sin solapamiento.
- Compactación visual de actividades con tres o más boundary events: se reduce el tamaño del marcador y se ocultan rótulos superpuestos solo en la vista general.
- CO01 y CO04 incorporan `calledElement` hacia el proceso común 08 en el BPMN distribuido con el proyecto.
- Se eliminó la excepción técnica de navegación para CO01/CO04.
- La vista **Por formalizar** contiene seis temas vigentes con solución propuesta y pasos de implementación.
- Se conservan 1 N0, 2 N1 y 15 N2: 18 diagramas en total.
>>>>>>> c8f4f3b0b54dd2f8fcc4bc3182ee0ae767177f94
