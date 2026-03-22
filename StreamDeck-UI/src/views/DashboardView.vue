<template>
  <div class="dashboard-screen">
    <!-- App Bar -->
    <header class="app-bar">
      <div class="app-bar-left">
        <v-icon color="primary" size="28">mdi-view-dashboard-variant</v-icon>
        <span class="app-title">StreamDeck <span class="accent">UI</span></span>
        <v-chip size="x-small" color="success" class="live-chip">
          <span class="live-dot" />
          EN VIVO
        </v-chip>
      </div>
      <div class="app-bar-center">
        <div class="stat-item">
          <v-icon size="14" color="secondary">mdi-account-multiple</v-icon>
          <span>{{ viewerCount }}</span>
        </div>
        <div class="stat-item">
          <v-icon size="14" color="error">mdi-heart</v-icon>
          <span>{{ followCount }}</span>
        </div>
        <div class="stat-item">
          <v-icon size="14" color="warning">mdi-clock-outline</v-icon>
          <span>{{ uptime }}</span>
        </div>
      </div>
      <div class="app-bar-right">
        <v-tooltip text="Volver al inicio" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="tonal"
              color="grey"
              @click="goBack"
            >
              <v-icon size="18">mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip :text="webGLSupported ? 'WebGL activo' : 'WebGL no disponible'" location="bottom">
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              size="x-small"
              :color="webGLSupported ? 'success' : 'error'"
              variant="tonal"
              class="webgl-chip"
            >
              <v-icon start size="12">mdi-vector-square</v-icon>
              WebGL
            </v-chip>
          </template>
        </v-tooltip>
      </div>
    </header>

    <!-- Drag hint banner -->
    <transition name="fade">
      <div v-if="showDragHint" class="drag-hint">
        <v-icon size="16" color="secondary">mdi-cursor-move</v-icon>
        Arrastra los widgets para reorganizarlos
        <v-btn size="x-small" variant="text" color="grey" @click="showDragHint = false">
          <v-icon size="14">mdi-close</v-icon>
        </v-btn>
      </div>
    </transition>

    <!-- Dashboard Grid -->
    <main class="dashboard-main">
      <div ref="swapyContainer" class="swapy-container">
        <!-- Slot A -->
        <div data-swapy-slot="a" class="grid-slot slot-large">
          <div data-swapy-item="chat" class="swapy-item">
            <ChatWidget />
          </div>
        </div>
        <!-- Slot B -->
        <div data-swapy-slot="b" class="grid-slot slot-medium">
          <div data-swapy-item="alerts" class="swapy-item">
            <AlertsWidget />
          </div>
        </div>
        <!-- Slot C -->
        <div data-swapy-slot="c" class="grid-slot slot-medium">
          <div data-swapy-item="camera" class="swapy-item">
            <CameraWidget />
          </div>
        </div>
        <!-- Slot D - 3D widget, disabled if no WebGL -->
        <div
          data-swapy-slot="d"
          class="grid-slot slot-large"
          :class="{ 'slot-no-drag': !webGLSupported }"
        >
          <div
            data-swapy-item="view3d"
            class="swapy-item"
            :v-if="true"
          >
            <div v-if="!webGLSupported" data-swapy-no-drag style="height:100%">
              <View3DWidget :disabled="true" />
            </div>
            <View3DWidget v-else :disabled="false" />
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createSwapy } from 'swapy'
import { useSystemStore } from '@/stores/systemStore'
import ChatWidget from '@/components/widgets/ChatWidget.vue'
import AlertsWidget from '@/components/widgets/AlertsWidget.vue'
import CameraWidget from '@/components/widgets/CameraWidget.vue'
import View3DWidget from '@/components/widgets/View3DWidget.vue'

const router = useRouter()
const store = useSystemStore()

const webGLSupported = computed(() => store.webGLSupported)
const swapyContainer = ref<HTMLElement | null>(null)
const showDragHint = ref(true)

// Stats
const viewerCount = ref(312)
const followCount = ref(1847)
const uptime = ref('00:00:00')

let swapyInstance: ReturnType<typeof createSwapy> | null = null
let statsInterval: ReturnType<typeof setInterval>
let uptimeInterval: ReturnType<typeof setInterval>
let uptimeSeconds = 0

function updateUptime() {
  uptimeSeconds++
  const h = Math.floor(uptimeSeconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((uptimeSeconds % 3600) / 60).toString().padStart(2, '0')
  const s = (uptimeSeconds % 60).toString().padStart(2, '0')
  uptime.value = `${h}:${m}:${s}`
}

function goBack() {
  router.push({ name: 'checklist' })
}

onMounted(() => {
  if (swapyContainer.value) {
    swapyInstance = createSwapy(swapyContainer.value, {
      animation: 'dynamic',
      swapMode: 'drop',
    })
  }

  statsInterval = setInterval(() => {
    viewerCount.value += Math.floor(Math.random() * 5) - 2
    if (Math.random() < 0.05) followCount.value++
  }, 2000)

  uptimeInterval = setInterval(updateUptime, 1000)
})

onUnmounted(() => {
  swapyInstance?.destroy()
  clearInterval(statsInterval)
  clearInterval(uptimeInterval)
})
</script>

<style scoped>
.dashboard-screen {
  min-height: 100vh;
  background: radial-gradient(ellipse at 10% 10%, rgba(155, 89, 245, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 90%, rgba(0, 245, 255, 0.06) 0%, transparent 50%),
    #0a0a14;
  display: flex;
  flex-direction: column;
}

/* App Bar */
.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(18, 18, 31, 0.95);
  border-bottom: 1px solid rgba(155, 89, 245, 0.15);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-bar-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.app-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #e8e8f0;
  letter-spacing: -0.3px;
}
.app-title .accent {
  background: linear-gradient(135deg, #9b59f5, #00f5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.live-chip {
  font-size: 0.65rem !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.live-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #fff;
  margin-right: 4px;
  animation: blink 1s ease infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

.app-bar-center {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(220, 220, 240, 0.8);
  font-variant-numeric: tabular-nums;
}
.app-bar-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.webgl-chip { font-size: 0.68rem !important; }

/* Drag hint */
.drag-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 245, 255, 0.06);
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
  font-size: 0.8rem;
  color: rgba(0, 245, 255, 0.7);
}

/* Dashboard Grid */
.dashboard-main {
  flex: 1;
  padding: 1.5rem;
}

.swapy-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
}

.grid-slot {
  min-height: 220px;
}

.slot-large {
  /* full row on small screens */
}
.slot-medium {
  /* half row */
}

.swapy-item {
  height: 100%;
  cursor: grab;
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.swapy-item:active {
  cursor: grabbing;
  transform: scale(0.98);
  box-shadow: 0 0 30px rgba(155, 89, 245, 0.3);
}

.slot-no-drag .swapy-item {
  cursor: not-allowed;
}
.slot-no-drag .swapy-item:active {
  transform: none;
  box-shadow: none;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 640px) {
  .swapy-container { grid-template-columns: 1fr; }
  .app-bar-center { display: none; }
}
</style>
