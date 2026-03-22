<template>
  <WidgetCard title="Vista 3D" icon="mdi-cube-scan" :disabled="disabled">
    <div class="view3d-content" :class="{ disabled }">
      <div class="cube-wrapper">
        <div class="cube" :class="{ 'cube-rotating': !disabled }">
          <div class="face front" />
          <div class="face back" />
          <div class="face left" />
          <div class="face right" />
          <div class="face top" />
          <div class="face bottom" />
        </div>
      </div>
      <div class="view3d-info" v-if="!disabled">
        <p class="info-line">WebGL 2.0 → <span class="pass">Activo</span></p>
        <p class="info-line">Renderer: {{ renderer }}</p>
        <p class="info-line">FPS: <span class="pass">60</span></p>
      </div>
      <div class="view3d-disabled-msg" v-else>
        <p>WebGL no está disponible</p>
        <p>Este módulo requiere aceleración gráfica</p>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WidgetCard from './WidgetCard.vue'

defineProps<{
  disabled: boolean
}>()

const renderer = ref('Detectando...')

onMounted(() => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (gl) {
      const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        const r = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
        renderer.value = r.split('/')[0].trim().slice(0, 28)
      } else {
        renderer.value = 'GPU detectada'
      }
    }
  } catch {
    renderer.value = 'N/A'
  }
})
</script>

<style scoped>
.view3d-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.view3d-content.disabled { filter: grayscale(1); }

/* CSS 3D Cube */
.cube-wrapper {
  perspective: 200px;
  width: 60px;
  height: 60px;
}
.cube {
  position: relative;
  width: 60px;
  height: 60px;
  transform-style: preserve-3d;
}
.cube-rotating {
  animation: rotate3d 6s linear infinite;
}
@keyframes rotate3d {
  from { transform: rotateX(20deg) rotateY(0deg); }
  to { transform: rotateX(20deg) rotateY(360deg); }
}
.face {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 1px solid rgba(155, 89, 245, 0.4);
  background: rgba(155, 89, 245, 0.07);
}
.front  { transform: translateZ(30px); }
.back   { transform: rotateY(180deg) translateZ(30px); }
.left   { transform: rotateY(-90deg) translateZ(30px); }
.right  { transform: rotateY(90deg) translateZ(30px); }
.top    { transform: rotateX(90deg) translateZ(30px); }
.bottom { transform: rotateX(-90deg) translateZ(30px); }

.view3d-info {
  text-align: center;
}
.info-line {
  margin: 0;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  color: rgba(200, 200, 224, 0.5);
}
.pass { color: #2ed573; font-weight: 700; }

.view3d-disabled-msg {
  text-align: center;
}
.view3d-disabled-msg p {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(200, 200, 224, 0.35);
}
</style>
