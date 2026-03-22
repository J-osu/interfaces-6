# Dashboard & Swapy

El Dashboard interactivo (`DashboardView.vue`) es el panel central de uso. Inspirado en herramientas como StreamDeck, hemos configurado un sistema **Drag and Drop** flexible.

## Arquitectura

El dashboard base cuenta con un Layout Grid (CSS Grid) que instiga la visualización organizada de las utilidades (Slots). Hemos predeterminado las dimensiones para slots "grandes" y "medianos" según la necesidad visual del widget.

### Interacciones de Usuario con Swapy
`Swapy` (`^1.0.5`) permite añadir interacciones modernas de intercambios con fricción dinámica sin requerir complejos scripts de movimiento de `draggables`.

Al invocar la inicialización:
```typescript
swapyInstance = createSwapy(swapyContainer.value, {
  animation: 'dynamic',
  swapMode: 'drop',
})
```

- **Manejo en los slots**:
  Hacemos uso de `data-swapy-slot` en los contenedores receptivos, y de `data-swapy-item` en los widgets.
  
- **Reactividad por Carencia Técnica**:
  Nuestra UI es inteligente gracias al `systemStore`. Cuando detectamos en la fase inicial que el usuario no tiene aceleración de vídeo:
  ```html
  <div v-if="!webGLSupported" data-swapy-no-drag style="height:100%">
    <View3DWidget :disabled="true" />
  </div>
  ```
  La clase y propiedad lógica transforman visualmente el ítem (filtros grises en CSS) y la directiva `data-swapy-no-drag` prohibe por completo mover e intercambiar ese módulo, advirtiendo de "WebGL no disponible".

## Topbar
Manejado a través de Flexbox simple con diseño "Glow", incorpora métricas falsas que varían con intervalos de JavaScript para dar esa percepción lúdica de streaming al dashboard.
