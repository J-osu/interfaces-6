<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

// Estados reactivos
const ancho = ref(1.5);
const alto = ref(1.5);
const profundidad = ref(1.5);
const colorCaja = ref('#c8a96e');
const mostrarToast = ref(false);
const mensajeToast = ref('');
const miCanvas = ref<HTMLCanvasElement | null>(null);

// Variables de Three.js
let escena: THREE.Scene;
let camara: THREE.PerspectiveCamera;
let renderizador: THREE.WebGLRenderer;
let caja: THREE.Mesh;
let material: THREE.MeshLambertMaterial;
let frameId: number;

function iniciarThree() {
  if (!miCanvas.value) return;
  const contenedor = miCanvas.value.parentElement!;

  // Escena
  escena = new THREE.Scene();
  escena.background = new THREE.Color(0xe8e8e8);

  // Cámara
  camara = new THREE.PerspectiveCamera(50, contenedor.clientWidth / contenedor.clientHeight, 0.1, 100);
  camara.position.set(3, 2, 4);
  camara.lookAt(0, 0, 0);

  // Renderizador
  renderizador = new THREE.WebGLRenderer({ canvas: miCanvas.value, antialias: true });
  renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);

  // Caja inicial
  const geometria = new THREE.BoxGeometry(ancho.value, alto.value, profundidad.value);
  material = new THREE.MeshLambertMaterial({ color: colorCaja.value });
  caja = new THREE.Mesh(geometria, material);
  escena.add(caja);

  // Luces
  const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
  escena.add(luzAmbiente);
  const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
  luzDireccional.position.set(5, 8, 5);
  escena.add(luzDireccional);

  const animar = () => {
    frameId = requestAnimationFrame(animar);
    if (caja) caja.rotation.y += 0.005;
    renderizador.render(escena, camara);
  };
  animar();
}

function actualizarGeometria() {
  if (caja) {
    caja.geometry.dispose();
    caja.geometry = new THREE.BoxGeometry(ancho.value, alto.value, profundidad.value);
  }
}

function detectarClic(evento: MouseEvent) {
  if (!miCanvas.value || !caja) return;
  const rect = miCanvas.value.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((evento.clientX - rect.left) / rect.width) * 2 - 1,
    -((evento.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camara);
  const intersecciones = raycaster.intersectObject(caja);

  if (intersecciones.length > 0) {
    mensajeToast.value = `📦 Ancho: ${ancho.value} | Alto: ${alto.value} | Prof: ${profundidad.value}`;
    mostrarToast.value = true;
    setTimeout(() => (mostrarToast.value = false), 3000);
  }
}

const handleResize = () => {
  const contenedor = miCanvas.value?.parentElement;
  if (!contenedor || !camara || !renderizador) return;
  camara.aspect = contenedor.clientWidth / contenedor.clientHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
};

// Observadores
watch([ancho, alto, profundidad], actualizarGeometria);
watch(colorCaja, (nuevo) => material?.color.set(nuevo));

onMounted(() => {
  iniciarThree();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(frameId);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <aside id="panel-lateral">
    <h2>📦 Diseñador de Caja</h2>

    <div class="campo">
      <label>Ancho: {{ ancho }} cm</label>
      <input type="range" min="0.5" max="3" step="0.1" v-model.number="ancho">
    </div>

    <div class="campo">
      <label>Alto: {{ alto }} cm</label>
      <input type="range" min="0.5" max="3" step="0.1" v-model.number="alto">
    </div>

    <div class="campo">
      <label>Profundidad: {{ profundidad }} cm</label>
      <input type="range" min="0.5" max="3" step="0.1" v-model.number="profundidad">
    </div>

    <div class="campo">
      <label>Color de la caja</label>
      <input type="color" v-model="colorCaja">
    </div>

    <div class="info-dimensiones">
      <p><strong>Dimensiones actuales:</strong></p>
      <p>W: {{ ancho }} | H: {{ alto }} | D: {{ profundidad }}</p>
    </div>
  </aside>

  <main id="escena-3d">
    <canvas ref="miCanvas" @click="detectarClic"></canvas>
    <div id="toast" :class="{ oculto: !mostrarToast }">{{ mensajeToast }}</div>
  </main>
</template>