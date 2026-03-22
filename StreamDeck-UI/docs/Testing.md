# Pruebas Unitarias (Testing)

Con el fin de asegurar el comportamiento y las determinaciones automáticas del sistema, implementamos el stack de `Vitest` y `jsdom`.

## Configuración y Ecosistema
Hemos utilizado `Vue Test Utils`, configurando un test runner moderno (`vitest.config.ts`) que hereda automáticamente los plugins de compilaciones de `vite.config.ts`, y corre emulando APIS globales mediante JsDOM, ideal porque nuestras lógicas de chequeos dependen en gran medida de los módulos nativos del BOM/DOM.

## Módulos Testeados

### 1. Pinia Store - `systemStore.ts`
Las pruebas en `systemStore.test.ts` apuntan a asegurar el correcto establecimiento de variables y los estados derivados (`computed`). 
Al mockear entradas donde faltan requisitos (por ejemplo la carencia de WebGL), la prueba verifica asertivamente que el getter `canEnterDashboard` o `allMandatoryChecksPassed` bloquee la experiencia asegurando que ningún usuario bypassée estas restricciones.

### 2. Composable - `useSystemCheck.ts`
En `useSystemCheck.test.ts` entramos en contacto directo con simulaciones de funciones BOM como `navigator` y métodos prototipados del DOM (`document.createElement`).
- Se interceptan (`vi.spyOn`) las creaciones de etiquetas `<audio>` o `<canvas>`.
- Devolvemos salidas controladas (ej: `'Mock GPU'`, o `'probably'`) para simular en tiempo de ejecución las respuestas de los APIs gráficas y multimedia del navegador.
- Validamos si tras procesarlos, nuestro estado final indica "Éxito" actualizando correctísimamente el almacén (Pinia `systemStore`) al final de todos los cálculos.

## Comandos

Para instalar el ecosistema entero de testing en caso de faltar en NodeModules:
```bash
npm install -D vitest @vue/test-utils jsdom @pinia/testing --legacy-peer-deps
```
Para ejecutar de forma rápida las comprobaciones sin interfaz:
```bash
npm run test
```
