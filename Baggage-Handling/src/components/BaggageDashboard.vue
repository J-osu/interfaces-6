<template>
  <div class="dashboard-screen">
    <!-- Navbar / Appbar separated from edge -->
    <header class="app-bar">
      <div class="app-bar-left">
        <div class="logo-circle">
          <v-icon icon="mdi-airport" size="22" color="#00f5ff"></v-icon>
        </div>
        <div class="d-flex flex-column justify-center ml-3">
          <h1 class="app-title">
            TSA <span class="accent">Control</span>
          </h1>
          <div class="d-flex align-center mt-1">
            <span class="live-dot" />
            <span class="live-text">TERMINAL 4 · LIVE SYNC</span>
          </div>
        </div>
      </div>
      
      <div class="app-bar-center">
         <!-- Time/Date -->
         <div class="stat-item">
           <v-icon size="14" color="secondary">mdi-clock-outline</v-icon>
           <span>{{ currentTime }}</span>
         </div>
      </div>
      
      <div class="app-bar-right">
        <div class="text-right d-none d-sm-block mr-4">
          <div class="text-xs font-mono mt-1" style="color:var(--text-muted)">{{ currentDate }}</div>
        </div>
        <v-avatar color="rgba(255,255,255,0.05)" size="36" class="border-glass">
          <v-icon icon="mdi-shield-account" size="18" color="#9b59f5"></v-icon>
        </v-avatar>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="max-w-7xl">
        <!-- Controls Row -->
        <div class="controls-row">
          <div class="controls-left">
            <h2>Flujo de Equipaje</h2>
            <p>Monitoreo de tránsito y estado operativo en tiempo real.</p>
          </div>

          <div class="controls-right">
            <!-- Sleek Toggle Group -->
            <div id="status-chips-container" class="glass-tabs">
              <button
                id="filter-all"
                class="sleek-tab"
                :class="{ 'active': filter === 'all' }"
                @click="setFilter('all')"
              >
                Global
              </button>
              <button
                id="filter-delayed"
                class="sleek-tab"
                :class="{ 'active delayed': filter === 'delayed' }"
                @click="setFilter('delayed')"
              >
                Retrasados
              </button>
              <button
                id="filter-ontime"
                class="sleek-tab"
                :class="{ 'active ontime': filter === 'ontime' }"
                @click="setFilter('ontime')"
              >
                A Tiempo
              </button>
            </div>
          </div>
        </div>

        <!-- Main Dashboard Layout -->
        <div class="dashboard-grid">
          <!-- Table Section -->
          <div class="grid-slot-large">
            <div id="flights-table-container" class="glass-card table-card">
              <div class="glass-card-header">
                <h3>En tránsito</h3>
              </div>
              
              <v-data-table
                :headers="headers"
                :items="filteredFlights"
                class="neon-table"
                :items-per-page="-1"
                hide-default-footer
                hover
              >
                <template #[`item.flightNo`]="{ item }">
                  <div class="d-flex align-center py-2">
                    <div class="flight-icon-box mr-4">
                      <v-icon icon="mdi-airplane" size="18" color="#e8e8f0"></v-icon>
                    </div>
                    <div>
                      <div class="flight-no">{{ item.flightNo }}</div>
                      <div class="flight-dest">{{ item.destination }}</div>
                    </div>
                  </div>
                </template>
                
                <template #[`item.belt`]="{ item }">
                  <span class="belt-badge">{{ item.belt }}</span>
                </template>
                
                <template #[`item.bags`]="{ item }">
                  <span class="bags-count">{{ item.bags }}</span>
                  <span class="bags-label">uds</span>
                </template>

                <template #[`item.status`]="{ item }">
                  <div class="status-container">
                    <span v-if="item.status === 'Retrasado'" class="status-dot red mr-2"></span>
                    <span v-else class="status-dot green mr-2"></span>
                    <span class="status-text" :class="item.status === 'Retrasado' ? 'text-red' : 'text-green'">
                      {{ item.status }}
                    </span>
                  </div>
                </template>
              </v-data-table>
            </div>
          </div>

          <!-- Emergency Widget Section -->
          <div class="grid-slot-medium">
            <div id="emergency-panel" class="glass-card emergency-card danger-border">
              <div class="emergency-header">
                <div class="danger-icon-wrapper">
                  <v-icon icon="mdi-alert" color="#ff003c" size="32"></v-icon>
                </div>
                <h3 class="danger-title">CÓDIGO ROJO</h3>
                <p class="danger-desc">
                  Parada general de la red mecánica.<br>Bloqueo inmediato de todas las cintas.
                </p>
              </div>
              
              <div class="emergency-body">
                <div class="button-guard-ring"></div>
                <button
                  id="btn-emergency-stop"
                  class="neon-red-btn"
                  @click="triggerEmergency"
                  aria-label="Parada de Emergencia"
                >
                  <span class="btn-text">PARADA<br>DE EMERGENCIA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Emergency Modal -->
    <v-dialog v-model="showEmergencyDialog" max-width="500" persistent>
      <div class="glass-card emergency-modal">
        <div class="emergency-header">
          <div class="danger-icon-wrapper">
            <v-icon icon="mdi-alert-octagon" color="#ff003c" size="48"></v-icon>
          </div>
          <h2 class="danger-title">¡ALERTA CRÍTICA!</h2>
        </div>
        <div class="emergency-modal-body">
          <p class="modal-text">Se ha iniciado la parada catastrófica del sistema.</p>
          <p class="modal-text-sub">Todas las cintas de equipaje han sido bloqueadas. El personal de seguridad y mantenimiento ha sido notificado.</p>
        </div>
        <div class="emergency-modal-actions">
          <button class="neon-red-btn-small" @click="showEmergencyDialog = false">
            RESTAURAR SISTEMAS
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export type FilterStatus = 'all' | 'delayed' | 'ontime'

export interface Flight {
  id: string
  flightNo: string
  destination: string
  belt: string
  bags: number
  status: 'A Tiempo' | 'Retrasado'
}

const filter = ref<FilterStatus>('all')
const emit = defineEmits<{ (e: 'update:filter', val: FilterStatus): void }>()

const currentTime = ref('')
const currentDate = ref('')
let timeInterval: ReturnType<typeof setInterval>
const showEmergencyDialog = ref(false)

const headers = [
  { title: 'VUELO', key: 'flightNo', align: 'start' as const, width: '35%' },
  { title: 'CINTA', key: 'belt', align: 'start' as const, width: '20%' },
  { title: 'VOLUMEN', key: 'bags', align: 'end' as const, width: '20%' },
  { title: 'ESTADO', key: 'status', align: 'center' as const, width: '25%' },
]

const flights: Flight[] = [
  { id: '1', flightNo: 'IB3145', destination: 'Madrid-Barajas', belt: 'C-12', bags: 145, status: 'A Tiempo' },
  { id: '2', flightNo: 'RY889', destination: 'London-Stansted', belt: 'A-04', bags: 189, status: 'Retrasado' },
  { id: '3', flightNo: 'AF112', destination: 'Paris-CDG', belt: 'B-07', bags: 93, status: 'A Tiempo' },
  { id: '4', flightNo: 'UX4012', destination: 'Miami Int.', belt: 'C-15', bags: 210, status: 'Retrasado' },
  { id: '5', flightNo: 'LH776', destination: 'Frankfurt Am Main', belt: 'A-02', bags: 120, status: 'A Tiempo' },
]

const filteredFlights = computed(() => {
  if (filter.value === 'delayed') return flights.filter(f => f.status === 'Retrasado')
  if (filter.value === 'ontime') return flights.filter(f => f.status === 'A Tiempo')
  return flights
})

function setFilter(status: FilterStatus) {
  filter.value = status
  emit('update:filter', status)
}

function triggerEmergency() {
  showEmergencyDialog.value = true
}

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})

defineExpose({
  filter,
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.dashboard-screen {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-main);
  background: transparent;
}

/* App Bar */
.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(18, 18, 31, 0.95);
  border-bottom: 1px solid var(--border-glass);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-bar-left {
  display: flex;
  align-items: center;
}
.logo-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #e8e8f0;
  letter-spacing: -0.3px;
  margin: 0;
  line-height: 1;
}
.app-title .accent {
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #2ed573;
  box-shadow: 0 0 6px #2ed573;
  margin-right: 6px;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.live-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.app-bar-center {
  display: flex;
  align-items: center;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.app-bar-right {
  display: flex;
  align-items: center;
}
.border-glass {
  border: 1px solid rgba(155, 89, 245, 0.3) !important;
}

/* Dashboard Grid */
.dashboard-main {
  flex: 1;
  padding: 2rem 1.5rem;
}
.max-w-7xl {
  max-width: 1400px;
  margin: 0 auto;
}

/* Controls */
.controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}
.controls-left h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #fff;
  line-height: 1.1;
}
.controls-left p {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}
.glass-tabs {
  background: rgba(18, 18, 31, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 4px;
  display: flex;
  gap: 4px;
  backdrop-filter: blur(8px);
}
.sleek-tab {
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.25s ease;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  border: none;
  font-family: inherit;
}
.sleek-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.sleek-tab.active {
  background: rgba(155, 89, 245, 0.15);
  box-shadow: inset 0 0 0 1px var(--neon-purple);
  color: #fff;
}
.sleek-tab.active.delayed {
  background: rgba(255, 0, 60, 0.15);
  box-shadow: inset 0 0 0 1px #ff003c;
}
.sleek-tab.active.ontime {
  background: rgba(46, 213, 115, 0.15);
  box-shadow: inset 0 0 0 1px #2ed573;
}

/* Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

/* Glass Cards */
.glass-card {
  background: rgba(18, 18, 31, 0.85);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  backdrop-filter: blur(16px);
}
.glass-card:hover {
  border-color: rgba(155, 89, 245, 0.45);
  box-shadow: 0 0 30px rgba(155, 89, 245, 0.12);
}
.glass-card-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}
.glass-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #e8e8f0;
}

/* Table Enhancements */
.table-card {
  min-height: 480px;
}
.neon-table {
  background: transparent !important;
  color: var(--text-main) !important;
}
.flight-icon-box {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.flight-no {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
}
.flight-dest {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.belt-badge {
  background: rgba(0, 245, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: ui-monospace, Consolas, monospace;
  color: var(--neon-cyan);
  border: 1px solid rgba(0, 245, 255, 0.3);
  font-weight: 600;
}
.bags-count {
  font-family: ui-monospace, Consolas, monospace;
  font-weight: 600;
  color: #fff;
}
.bags-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-left: 4px;
}
.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-dot {
  width: 8px; height: 8px; border-radius: 50%;
}
.status-dot.green { background: #2ed573; box-shadow: 0 0 8px #2ed573; }
.status-dot.red { background: #ff003c; box-shadow: 0 0 8px #ff003c; animation: pulse-red 1.5s infinite; }
@keyframes pulse-red { 0%, 100% { opacity: 1; box-shadow: 0 0 8px #ff003c; } 50% { opacity: 0.5; box-shadow: 0 0 16px #ff003c; } }
.status-text {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.text-green { color: #2ed573; }
.text-red { color: #ff003c; }

:deep(.v-data-table) {
  background: transparent !important;
}
:deep(.v-data-table th) {
  background-color: transparent !important;
  color: var(--text-muted) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
:deep(.v-data-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  height: 64px !important;
  color: #fff !important;
}
:deep(.v-data-table__tr:hover td) {
  background: rgba(155, 89, 245, 0.08) !important;
}

/* Emergency Card */
.emergency-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.danger-border {
  border-color: rgba(255, 0, 60, 0.3);
}
.danger-border:hover {
  border-color: rgba(255, 0, 60, 0.6);
  box-shadow: 0 0 30px rgba(255, 0, 60, 0.15);
}
.emergency-header {
  padding: 1.5rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(255, 0, 60, 0.08) 0%, transparent 100%);
}
.danger-icon-wrapper {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: rgba(255, 0, 60, 0.1);
  border: 1px solid rgba(255, 0, 60, 0.3);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 0 20px rgba(255, 0, 60, 0.2);
}
.danger-title {
  color: #ff003c;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem;
}
.danger-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin: 0;
}

.emergency-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

/* Cyberpunk Red Button */
.button-guard-ring {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(10, 10, 14, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
  pointer-events: none;
}

.neon-red-btn {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff4d79, #e60036 60%, #990024);
  border: none;
  box-shadow: 
    0 10px 25px rgba(0,0,0,0.6),
    inset 0 -8px 16px rgba(0,0,0,0.4),
    inset 0 8px 16px rgba(255, 255, 255, 0.3),
    0 0 0 8px rgba(18, 18, 31, 1),
    0 0 0 10px rgba(255, 0, 60, 0.3),
    0 0 40px rgba(255, 0, 60, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.neon-red-btn:hover {
  box-shadow: 
    0 15px 35px rgba(0,0,0,0.7),
    inset 0 -8px 16px rgba(0,0,0,0.4),
    inset 0 8px 16px rgba(255, 255, 255, 0.4),
    0 0 0 8px rgba(18, 18, 31, 1),
    0 0 0 10px rgba(255, 0, 60, 0.5),
    0 0 60px rgba(255, 0, 60, 0.7);
}

.neon-red-btn:active {
  transform: translateY(4px) scale(0.95);
  box-shadow: 
    0 5px 15px rgba(0,0,0,0.8),
    inset 0 -4px 10px rgba(0,0,0,0.6),
    inset 0 12px 24px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(18, 18, 31, 1),
    0 0 0 10px rgba(255, 0, 60, 0.4);
}

.btn-text {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.08em;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  text-align: center;
}

/* Emergency Modal */
.emergency-modal {
  border-color: rgba(255, 0, 60, 0.5);
  box-shadow: 0 0 50px rgba(255, 0, 60, 0.2);
  padding: 0;
}
.emergency-modal .emergency-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(180deg, rgba(255, 0, 60, 0.15) 0%, transparent 100%);
}
.emergency-modal .danger-icon-wrapper {
  width: 80px; height: 80px;
  border-width: 2px;
}
.emergency-modal-body {
  padding: 0 2rem 2rem;
  text-align: center;
}
.modal-text {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.modal-text-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}
.emergency-modal-actions {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}
.neon-red-btn-small {
  padding: 12px 24px;
  border-radius: 8px;
  background: rgba(255, 0, 60, 0.1);
  border: 1px solid rgba(255, 0, 60, 0.4);
  color: #ff003c;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.neon-red-btn-small:hover {
  background: rgba(255, 0, 60, 0.2);
  box-shadow: 0 0 15px rgba(255, 0, 60, 0.3);
  transform: translateY(-2px);
}
</style>
