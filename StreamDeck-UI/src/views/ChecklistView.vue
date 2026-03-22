<template>
  <div class="checklist-screen">
    <!-- Animated background particles -->
    <div class="bg-particles">
      <div v-for="n in 20" :key="n" class="particle" :style="particleStyle(n)" />
    </div>

    <!-- Main content -->
    <div class="checklist-container">
      <!-- Header -->
      <div class="header">
        <div class="logo-wrapper">
          <v-icon size="52" color="primary" class="logo-icon">mdi-view-dashboard-variant</v-icon>
          <div class="logo-glow" />
        </div>
        <h1 class="title">StreamDeck <span class="gradient-text">UI</span></h1>
        <p class="subtitle">Verificando compatibilidad del sistema</p>
      </div>

      <!-- Check Items -->
      <div class="checks-list">
        <transition-group name="check-slide" appear>
          <div
            v-for="(check, index) in checks"
            :key="check.id"
            class="check-item"
            :class="[`status-${check.status}`, { optional: check.optional }]"
            :style="{ transitionDelay: `${index * 0.08}s` }"
          >
            <div class="check-icon-wrapper">
              <v-progress-circular
                v-if="check.status === 'checking'"
                indeterminate
                size="28"
                width="2"
                color="secondary"
                class="spin"
              />
              <v-icon v-else size="28" :color="iconColor(check.status)">
                {{ statusIcon(check.status) }}
              </v-icon>
            </div>
            <div class="check-body">
              <div class="check-header-row">
                <span class="check-label">{{ check.label }}</span>
                <v-chip
                  v-if="check.optional"
                  size="x-small"
                  variant="outlined"
                  color="grey"
                  class="optional-chip"
                >
                  Opcional
                </v-chip>
                <v-chip
                  v-if="check.status !== 'pending'"
                  size="x-small"
                  :color="chipColor(check.status)"
                  class="status-chip"
                >
                  {{ statusLabel(check.status) }}
                </v-chip>
              </div>
              <p class="check-description">{{ check.description }}</p>
              <p v-if="check.detail" class="check-detail">{{ check.detail }}</p>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Progress bar -->
      <div class="progress-wrapper">
        <v-progress-linear
          :model-value="progressValue"
          color="primary"
          background-color="surface-variant"
          rounded
          height="4"
          class="progress-bar"
        />
        <span class="progress-label">{{ progressValue }}%</span>
      </div>

      <!-- Enter button -->
      <div class="action-wrapper">
        <v-tooltip
          :text="!checksRunning && !canEnterDashboard ? failReasonMessage : ''"
          location="top"
          :disabled="canEnterDashboard || checksRunning"
        >
          <template #activator="{ props }">
            <div v-bind="props">
              <v-btn
                id="enter-dashboard-btn"
                size="x-large"
                :color="canEnterDashboard ? 'primary' : 'grey'"
                :disabled="!canEnterDashboard || checksRunning"
                class="enter-btn"
                :class="{ 'btn-glow': canEnterDashboard }"
                prepend-icon="mdi-rocket-launch"
                @click="enterDashboard"
              >
                Entrar al Dashboard
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <p v-if="checksRunning" class="running-hint">
          <v-icon size="14" color="secondary">mdi-loading mdi-spin</v-icon>
          Analizando sistema...
        </p>
        <p v-if="!checksRunning && !canEnterDashboard && checksCompleted" class="fail-hint">
          <v-icon size="14" color="error">mdi-alert-circle</v-icon>
          {{ failReasonMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemCheck, type CheckItem } from '@/composables/useSystemCheck'
import { useSystemStore } from '@/stores/systemStore'

const router = useRouter()
const store = useSystemStore()
const { checks, runAllChecks } = useSystemCheck()

const checksRunning = ref(false)
const checksCompleted = computed(() => store.checksCompleted)
const canEnterDashboard = computed(() => store.canEnterDashboard)

const progressValue = computed(() => {
  const total = checks.value.length
  const done = checks.value.filter((c) => c.status !== 'pending' && c.status !== 'checking').length
  if (checksRunning.value) {
    const checking = checks.value.filter((c) => c.status === 'checking').length
    return Math.round(((done + checking * 0.5) / total) * 100)
  }
  return Math.round((done / total) * 100)
})

const failReasonMessage = computed(() => {
  if (store.checksCompleted) {
    if (!store.webGLSupported) return 'WebGL es necesario para el dashboard'
    if (!store.opusSupported) return 'El codec Opus es requerido'
  }
  return ''
})

function particleStyle(n: number) {
  const size = Math.random() * 3 + 1
  return {
    left: `${(n * 17.3) % 100}%`,
    top: `${(n * 31.7) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${(n * 0.4) % 4}s`,
    animationDuration: `${3 + (n % 4)}s`,
  }
}

function iconColor(status: CheckItem['status']) {
  const map: Record<CheckItem['status'], string> = {
    pending: 'grey',
    checking: 'secondary',
    pass: 'success',
    fail: 'error',
    warn: 'warning',
  }
  return map[status]
}

function statusIcon(status: CheckItem['status']) {
  const map: Record<CheckItem['status'], string> = {
    pending: 'mdi-circle-outline',
    checking: 'mdi-loading',
    pass: 'mdi-check-circle',
    fail: 'mdi-close-circle',
    warn: 'mdi-alert-circle',
  }
  return map[status]
}

function chipColor(status: CheckItem['status']) {
  const map: Record<CheckItem['status'], string> = {
    pending: 'grey',
    checking: 'secondary',
    pass: 'success',
    fail: 'error',
    warn: 'warning',
  }
  return map[status]
}

function statusLabel(status: CheckItem['status']) {
  const map: Record<CheckItem['status'], string> = {
    pending: 'Pendiente',
    checking: 'Verificando...',
    pass: 'Correcto',
    fail: 'Fallo',
    warn: 'Advertencia',
  }
  return map[status]
}

async function enterDashboard() {
  await router.push({ name: 'dashboard' })
}

onMounted(async () => {
  if (store.checksCompleted) return
  checksRunning.value = true
  await new Promise<void>((r) => setTimeout(r, 600))
  await runAllChecks()
  checksRunning.value = false
})
</script>

<style scoped>
.checklist-screen {
  min-height: 100vh;
  background: radial-gradient(ellipse at 20% 50%, rgba(155, 89, 245, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
    var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Particles */
.bg-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(155, 89, 245, 0.4);
  animation: float linear infinite;
}
@keyframes float {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { opacity: 0.2; }
  100% { transform: translateY(-60px) scale(0.6); opacity: 0; }
}

/* Container */
.checklist-container {
  width: 100%;
  max-width: 640px;
  padding: 2.5rem;
  background: rgba(18, 18, 31, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(155, 89, 245, 0.2);
  border-radius: 24px;
  box-shadow: 0 0 60px rgba(155, 89, 245, 0.1), 0 24px 64px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.logo-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 0.75rem;
}
.logo-icon {
  position: relative;
  z-index: 1;
}
.logo-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(155, 89, 245, 0.35) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #e8e8f0;
  margin: 0;
  letter-spacing: -0.5px;
}
.gradient-text {
  background: linear-gradient(135deg, #9b59f5 0%, #00f5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.subtitle {
  margin: 0.4rem 0 0;
  color: rgba(200, 200, 224, 0.6);
  font-size: 0.93rem;
  letter-spacing: 0.3px;
}

/* Checks List */
.checks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.35s ease;
}
.check-item.status-pass {
  border-color: rgba(46, 213, 115, 0.25);
  background: rgba(46, 213, 115, 0.05);
}
.check-item.status-fail {
  border-color: rgba(255, 71, 87, 0.3);
  background: rgba(255, 71, 87, 0.06);
}
.check-item.status-warn {
  border-color: rgba(255, 165, 2, 0.25);
  background: rgba(255, 165, 2, 0.05);
}
.check-item.status-checking {
  border-color: rgba(0, 245, 255, 0.25);
  background: rgba(0, 245, 255, 0.04);
}

.check-icon-wrapper {
  flex-shrink: 0;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
}

.check-body {
  flex: 1;
  min-width: 0;
}
.check-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}
.check-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e8e8f0;
}
.optional-chip, .status-chip {
  font-size: 0.68rem !important;
}
.check-description {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(200, 200, 224, 0.55);
}
.check-detail {
  margin: 0.3rem 0 0;
  font-size: 0.78rem;
  color: rgba(200, 200, 224, 0.4);
  font-family: 'Courier New', monospace;
}

/* Progress */
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}
.progress-bar {
  flex: 1;
}
.progress-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(200, 200, 224, 0.5);
  width: 36px;
  text-align: right;
}

/* Action */
.action-wrapper {
  text-align: center;
}
.enter-btn {
  min-width: 260px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.25s ease !important;
}
.enter-btn.btn-glow {
  box-shadow: 0 0 24px rgba(155, 89, 245, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4) !important;
}
.enter-btn:not(:disabled):hover {
  transform: translateY(-2px);
}
.running-hint, .fail-hint {
  margin: 0.75rem 0 0;
  font-size: 0.82rem;
  color: rgba(200, 200, 224, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}
.fail-hint {
  color: rgba(255, 71, 87, 0.7);
}

/* Transitions */
.check-slide-enter-active {
  transition: all 0.4s ease;
}
.check-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
