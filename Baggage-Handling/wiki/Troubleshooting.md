# Registro de Errores y Troubleshooting

## Error: Type-Checking Modules en `tsconfig.app.json`
**Problema:** Al ejecutar el servidor (o construir la app), surgían errores marcando que el valor "module" en el TSConfig era inválido, junto con alertas esporádicas de que `ImportMeta` no contenía la propiedad `env` o errores al compilar con `vue-tsc --noEmit`.
**Solución:** Se tuvo que ajustar estrechamente la configuración en `tsconfig.app.json` configurando `"moduleResolution": "bundler"` y proveyendo los tipos completos para Vite (o reconectando correctamente el archivo `env.d.ts` con directivas completas de Vite) para satisfacer al compilador en un entorno moderno.

## Reto: Refactorización CSS Temática "Neón"
**Problema:** Se requirió una refactorización profunda para llevar la aplicación de un tema utilitario (parecido a Tailwind usando pseudo-clases integradas en linea/App.vue) a un entorno temático de neón oscuro tomado como referencia de "StreamDeck-UI", y hacertlo desde la base CSS de 0.
**Solución:** 
1. Se limpió el CSS nativo de Vuetify para evitar sobrescrituras pesadas en el index global.
2. Se reemplazaron todas las utilidades por un sistema metódico de variables de CSS (`:root`) en `style.css` inyectando gradientes radiales fijos como fondo central.
3. Se integró una capa de "Glassmorphism" nativo combinando transparencias `rgba()`, `box-shadow` sutil púrpura, y la directiva `backdrop-filter: blur(16px)` para darle profundidad a las tarjetas de métricas.
4. Se actualizó el primitivo `alert()` nativo para parada de emergencia migrándolo hacia un `<v-dialog>` incrustado en Vuetify sin romper la sinergia global del DOM de los estilos (modificando las opacidades y sombras al vuelo del modal).

## Error: Pruebas con Vitest y `<v-dialog>` en JSDOM
**Problema:** Al ejecutar pruebas unitarias con `@vue/test-utils` y `jsdom` en componentes que utilizan `<v-dialog>` (como el botón de emergencia), Vitest lanzaba errores de inicio (Startup Error) o fallos en el renderizado de `<v-overlay>`.
**Solución:** Los componentes de overlays y modales de Vuetify 3 (como `<v-dialog>`) requieren APIs del navegador que no existen en JSDOM por defecto, como `ResizeObserver`. Para evitar bloqueos, se documenta la necesidad de escribir "polyfills" manuales de `ResizeObserver` en el setup de los tests, o excluir interacciones profundas de modales en las pruebas unitarias simples.
