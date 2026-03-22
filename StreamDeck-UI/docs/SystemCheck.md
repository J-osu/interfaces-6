# System Check & Hardware Detection

Antes de acceder al panel principal (Dashboard), la aplicación se asegura de que la experiencia del usuario sea óptima. Para ello, realiza una serie de verificaciones de hardware de forma **nativa utilizando JavaScript**.

## ¿Qué verificamos?

1. **Aceleración WebGL (`webGLSupported`)**
   - **Importancia**: Requerido por widgets de visualización 3D y algunos efectos.
   - **Implementación**: Se genera un `HTMLCanvasElement` en memoria y se intenta obtener su contexto `webgl2` o `webgl`. Se evalúa si existe o no capacidad del renderer.

2. **Soporte del Códec Opus (`opusSupported`)**
   - **Importancia**: Estándar moderno en streaming de audio.
   - **Implementación**: Mediante la creación de una etiqueta `<audio>` temporal usando `canPlayType('audio/webm; codecs=opus')`.

3. **Soporte del Códec HEVC / H.265 (`h265Supported`)**
   - **Importancia**: Alta compresión para consumo de video en alta definición.
   - **Implementación**: Similar al audio pero evaluando un elemento `<video>` (`hev1` o `hvc1`).

4. **Estado de la Conexión (`isOnline`)**
   - Se consulta `navigator.onLine` e información detallada de `navigator.connection` (Network Information API).

5. **Nivel de Batería (`batteryLevel`)**
   - Mediante la *Battery Status API* (`navigator.getBattery()`), identificando si el nivel es excesivamente bajo.

## Experiencia en UI ( `ChecklistView.vue` )
El proceso dura un par de segundos con animaciones graduales para no ser brusco, bloqueando inicialmente la entrada al Dashboard y habilitando su acceso automático o manual solo si las variables **críticas** (WebGL y Opus) están en estado de **pass**.
