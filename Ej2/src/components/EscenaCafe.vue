<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

const zonaRef = ref<HTMLElement | null>(null);
const progreso = ref(0); // 0 a 1
const progresoPct = computed(() => Math.round(progreso.value * 100));

// Datos de las tarjetas
const tarjetas = [
  { titulo: 'Temperatura',    valor: '92 °C — agua perfecta',   desde: 0.15 },
  { titulo: 'Molienda',       valor: 'Fina, recién molida',      desde: 0.35 },
  { titulo: 'Tiempo extracción', valor: '25 – 30 segundos',         desde: 0.55 },
  { titulo: 'Ratio',          valor: '1:15 café / agua',         desde: 0.75 },
];

const tarjetasVisibles = reactive(tarjetas.map(() => false));

const nivelCafe = computed(() => {
  const yVacio = 330;
  const yLleno = 204;
  return yVacio - progreso.value * (yVacio - yLleno);
});

const opacidadVapor = computed(() => {
  const inicio = 0.7;
  return Math.max(0, (progreso.value - inicio) / (1 - inicio));
});

const vaporOffset = computed(() => Math.max(0, (progreso.value - 0.7) / 0.3));

const vaporIzq = computed(() => {
  const base = 190;
  const amp  = 10 * vaporOffset.value;
  const alto = 90 * vaporOffset.value;
  return `M168,${base} Q${168 - amp},${base - alto * 0.45} 168,${base - alto * 0.72} Q${168 + amp},${base - alto * 0.88} 164,${base - alto}`;
});

const vaporCentro = computed(() => {
  const base = 190;
  const amp  = 13 * vaporOffset.value;
  const alto = 115 * vaporOffset.value;
  return `M200,${base} Q${200 + amp},${base - alto * 0.38} 200,${base - alto * 0.65} Q${200 - amp},${base - alto * 0.82} 200,${base - alto}`;
});

const vaporDer = computed(() => {
  const base = 190;
  const amp  = 10 * vaporOffset.value;
  const alto = 90 * vaporOffset.value;
  return `M232,${base} Q${232 + amp},${base - alto * 0.45} 232,${base - alto * 0.72} Q${232 - amp},${base - alto * 0.88} 236,${base - alto}`;
});

// Manejador de scroll
function manejarScroll() {
  const zona = zonaRef.value;
  if (!zona) return;

  const { top, height } = zona.getBoundingClientRect();
  const scrollable = height - window.innerHeight;
  const p = Math.min(1, Math.max(0, -top / scrollable));
  progreso.value = p;

  tarjetas.forEach((t, i) => {
    tarjetasVisibles[i] = p >= t.desde;
  });
}

onMounted(() => {
  window.addEventListener('scroll', manejarScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', manejarScroll);
});
</script>

<template>
  <div class="barra-progreso" :style="{ width: progresoPct + '%' }"></div>

  <div class="zona-scroll" ref="zonaRef">
    <div class="sticky-escena">
      
      <svg class="svg-cafe" viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clip-interior">
            <path d="M122,202 L278,202 L268,330 L132,330 Z"/>
          </clipPath>
          <clipPath id="clip-vapor">
            <rect x="100" y="30" width="200" height="170"/>
          </clipPath>
        </defs>

        <path d="M118,200 L282,200 L270,332 L130,332 Z" fill="#7a4520"/>
        <path d="M255,204 L270,332 L258,332 L243,204 Z" fill="#5c3210" opacity="0.5"/>

        <g clip-path="url(#clip-interior)">
          <path d="M122,202 L278,202 L268,330 L132,330 Z" fill="#1a0a02"/>
          <rect x="115" :y="nivelCafe" width="170" height="335" fill="#5c2e00" />
          <ellipse cx="200" :cy="nivelCafe" rx="76" ry="9" fill="#7a3d00" />
          <ellipse cx="185" :cy="nivelCafe - 1" rx="22" ry="3" fill="#c07840" opacity="0.45" />
        </g>

        <ellipse cx="200" cy="200" rx="82" ry="16" fill="#8b5225"/>
        <ellipse cx="200" cy="198" rx="78" ry="13" fill="#2a100a"/>
        <ellipse cx="200" cy="200" rx="82" ry="16" fill="none" stroke="#a06030" stroke-width="1.5"/>

        <path d="M272,222 Q330,222 330,277 Q330,318 272,318" stroke="#8b5225" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M272,222 Q318,222 318,277 Q318,308 272,318" stroke="#3d1f08" stroke-width="10" fill="none" stroke-linecap="round"/>

        <ellipse cx="200" cy="350" rx="108" ry="12" fill="#3d1f08"/>
        <ellipse cx="200" cy="346" rx="108" ry="11" fill="#7a4520"/>
        <ellipse cx="200" cy="344" rx="104" ry="9"  fill="#8b5225"/>

        <g clip-path="url(#clip-vapor)" :opacity="opacidadVapor">
          <path :d="vaporIzq" stroke="#d0c0b0" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path :d="vaporCentro" stroke="#d0c0b0" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
          <path :d="vaporDer" stroke="#d0c0b0" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
        </g>
      </svg>

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

<style scoped>
/* Estilos necesarios para el funcionamiento */
.barra-progreso {
  position: fixed;
  top: 0; left: 0;
  height: 4px;
  background: #e8a060;
  z-index: 100;
}

.zona-scroll {
  position: relative;
  height: 400vh; /* Controla la velocidad del scroll */
}

.sticky-escena {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #1a1008;
}

.svg-cafe {
  width: min(420px, 88vw);
  height: min(420px, 88vw);
  z-index: 1;
}

.tarjetas-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.tarjeta {
  position: absolute;
  background: rgba(20, 10, 0, 0.85);
  border: 1px solid #80502a;
  border-radius: 8px;
  padding: 12px;
  color: #f0e0c0;
  max-width: 180px;
  transition: all 0.5s ease;
}

.tarjeta-oculta { opacity: 0; transform: translateY(20px); }
.tarjeta-visible { opacity: 1; transform: translateY(0); }

.tarjeta-0 { top: 15%; left: 5%; }
.tarjeta-1 { top: 20%; right: 5%; }
.tarjeta-2 { bottom: 20%; left: 5%; }
.tarjeta-3 { bottom: 15%; right: 5%; }

strong { color: #e8a060; display: block; margin-bottom: 4px; }
</style>