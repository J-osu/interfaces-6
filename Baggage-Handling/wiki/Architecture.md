# Arquitectura del Proyecto

## Stack Tecnológico
- **Vue 3 (Composition API)** a través de Vite.
- **TypeScript** para seguridad de tipado estricta.
- **Vuetify 3** para componentes base (Grid, Dialogs, Tables).
- **Vitest** para pruebas unitarias simulando el DOM con `jsdom`.

## Estructura de Componentes
- `App.vue`: El punto de entrada principal donde se envuelven la aplicación web con `<v-app>` y gestiona las directivas del Tour (Shepherd).
- `BaggageDashboard.vue`: El núcleo de la aplicación.
  - Gestiona el estado local del filtrado mediante `ref<'all' | 'delayed' | 'ontime'>`.
  - Contiene toda la lógica de presentación con CSS Vanilla usando estilos "Glassmorphism" integrados mediante scoping.
- `useDashboardTour.ts`: Un composable exportado para controlar lógicamente las transiciones del tutorial interactuando directamente con los IDs del DOM de los elementos objetivo.
