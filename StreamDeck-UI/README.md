# StreamDeck UI

Un dashboard interactivo y reactivo enfocado en una interfaz similar a "StreamDeck", desarrollado con **Vue 3**, **TypeScript**, **Vuetify** y **Vite**.

## Características Principales

1. **Verify (System Check) al Iniciar**
   - Una pantalla de verificación (`ChecklistView.vue`) interactiva que evalúa fluidamente las capacidades del navegador.
   - Detecta de forma nativa aceleración de hardware **WebGL**.
   - Evalúa compatibilidad de códecs modernos como audio **Opus** y vídeo **H.265 (HEVC)**.
   - Verifica el estado de la conexión de red (online, ping) y, si el navegador lo soporta, el estado de **Batería** (Battery API).
   - Bloquea la entrada al sistema principal si faltan características indispensables (WebGL y Opus).

2. **Panel de Dashboard Dinámico**
   - Construido con una grilla (CSS Grid + variables flexbox de Vuetify).
   - Utiliza **[Swapy](https://swapy.dev)** para proveer funcionalidad de **Drag and Drop** nativa y animada.
   - Estadísticas simuladas en tiempo real (visitas, follows, uptime).

3. **Reactividad por Carencia de Hardware**
   - Si el sistema no posee aceleración WebGL, el módulo "Vista 3D" en el Dashboard se bloquea visualmente y pierde la capacidad de ser arrastrado (Data attributes adaptativos con Swapy).

4. **Testing Integrado**
   - Integración nativa con **Vitest** y **jsdom** para evaluar con máxima asertividad las reglas de negocio (Store de Pinia `systemStore`) y las validaciones de hardware (Composition API `useSystemCheck`).

## Requisitos Previos
- [Node.js](https://nodejs.org/) v18+ 
- npm o yarn

## Instalación y Ejecución Local

1. Instalar las dependencias del proyecto:
```bash
npm install
```

2. Ejecutar el servidor en entorno de desarrollo:
```bash
npm run dev
```

3. (Opcional) Compilar para producción:
```bash
npm run build
```

## Ejecución de Pruebas (Test Unitarios)

El proyecto cuenta con testing para la lógica de componentes sin dependencias de renderizado duro, asegurando la robustez de las verificaciones de sistema.

```bash
npm install -D vitest @vue/test-utils jsdom @pinia/testing --legacy-peer-deps
```

Para correr las pruebas una vez instaladas:
```bash
npm run test
```

## Estructura Relevante
- `src/stores/systemStore.ts` : Centraliza el estado de las validaciones de hardware y conectividad.
- `src/composables/useSystemCheck.ts` : Encapsula las detecciones nativas mediante APIS del navegador (`HTMLCanvasElement`, `HTMLAudioElement`, `navigator.connection`, `navigator.getBattery()`).
- `src/views/ChecklistView.vue` : Muestra una animación interactiva con partículas listando checklist del hardware antes de entrar al Dashboard.
- `src/views/DashboardView.vue` : Contiene la instanciación de Swapy, y el grid interactivo para arrastrar paneles de chat, alertas, cámara, y gráficos 3D.
