<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import lottie from 'lottie-web';

const zonaRef = ref<HTMLElement | null>(null);
const progreso = ref(0);
const progresoPct = computed(() => Math.round(progreso.value * 100));

// TUS DATOS ORIGINALES
const tarjetas = [
  { titulo: 'Temperatura',    valor: '92 °C — agua perfecta',      desde: 0.15 },
  { titulo: 'Molienda',       valor: 'Fina, recién molida',         desde: 0.35 },
  { titulo: 'Tiempo extracción', valor: '25 – 30 segundos',         desde: 0.55 },
  { titulo: 'Ratio',          valor: '1:15 café / agua',            desde: 0.75 },
];

const tarjetasVisibles = reactive(tarjetas.map(() => false));

let animacion: any = null;
let totalFrames = 0;

// TU FUNCIÓN ORIGINAL
function iniciarLottie() {
  animacion = lottie.loadAnimation({
    container: document.getElementById('lottie-contenedor')!,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://assets10.lottiefiles.com/packages/lf20_5njpvhs0.json',
  });

  animacion.addEventListener('DOMLoaded', () => {
    totalFrames = animacion.totalFrames;
  });
}

// TU FUNCIÓN ORIGINAL
function manejarScroll() {
  const zona = zonaRef.value;
  if (!zona) return;

  const { top, height } = zona.getBoundingClientRect();
  const scrollable = height - window.innerHeight;
  const desplazado = -top;
  const p = Math.min(1, Math.max(0, desplazado / scrollable));
  progreso.value = p;

  if (animacion && totalFrames > 0) {
    const frame = Math.floor(p * totalFrames);
    animacion.goToAndStop(frame, true);
  }

  tarjetas.forEach((t, i) => {
    tarjetasVisibles[i] = p >= t.desde;
  });
}

onMounted(() => {
  iniciarLottie();
  window.addEventListener('scroll', manejarScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', manejarScroll);
  if (animacion) animacion.destroy();
});
</script>

<template>
  <div class="barra-progreso" :style="{ width: progresoPct + '%' }"></div>

  <div class="zona-scroll" ref="zonaRef">
    <div class="sticky-escena">
      <div id="lottie-contenedor"></div>

      <div class="tarjetas-wrapper">
        <div
          v-for="(tarjeta, i) in tarjetas"
          :key="i"
          :class="['tarjeta', `tarjeta-${i}`, tarjetasVisibles[i] ? 'tarjeta-visible' : 'tarjeta-oculta']"
        >
          <strong>{{ tarjeta.titulo }}</strong>
          {{ tarjeta.valor }}
        </div>
      </div>
    </div>
  </div>
</template>