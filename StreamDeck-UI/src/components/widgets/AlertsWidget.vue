<template>
  <WidgetCard title="Sistema de Alertas" icon="mdi-bell-ring">
    <div class="alerts-list">
      <transition-group name="alert-pop">
        <div v-for="alert in activeAlerts" :key="alert.id" class="alert-item" :class="`type-${alert.type}`">
          <v-icon size="18" :color="alertColor(alert.type)">{{ alertIcon(alert.type) }}</v-icon>
          <div class="alert-body">
            <span class="alert-title">{{ alert.message }}</span>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="alert-counters">
      <div v-for="type in alertTypes" :key="type.key" class="counter-item">
        <v-icon size="14" :color="type.color">{{ type.icon }}</v-icon>
        <span>{{ counts[type.key] }}</span>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import WidgetCard from './WidgetCard.vue'

type AlertType = 'follow' | 'sub' | 'donation' | 'raid'

interface Alert {
  id: number
  type: AlertType
  message: string
  time: string
}

const alertTypes = [
  { key: 'follow', icon: 'mdi-heart', color: '#ff6b9d' },
  { key: 'sub', icon: 'mdi-star', color: '#f39c12' },
  { key: 'donation', icon: 'mdi-cash', color: '#2ed573' },
  { key: 'raid', icon: 'mdi-lightning-bolt', color: '#9b59f5' },
] as const

const counts = reactive<Record<AlertType, number>>({ follow: 14, sub: 3, donation: 2, raid: 0 })
const now = () => new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const activeAlerts = ref<Alert[]>([
  { id: 1, type: 'follow', message: 'GamerPro_ te sigue!', time: now() },
  { id: 2, type: 'sub', message: 'NoobMaster se suscribió (Tier 1)', time: now() },
  { id: 3, type: 'donation', message: 'XxDarkxX donó €5.00', time: now() },
])
let nextId = 10
let interval: ReturnType<typeof setInterval>

const templates: Record<AlertType, () => string> = {
  follow: () => `User${Math.floor(Math.random() * 9999)} te sigue!`,
  sub: () => `Fan${Math.floor(Math.random() * 999)} se suscribió!`,
  donation: () => `Donación de €${(Math.random() * 20 + 1).toFixed(2)}`,
  raid: () => `Raid de ${Math.floor(Math.random() * 200 + 10)} viewers!`,
}

onMounted(() => {
  interval = setInterval(() => {
    const types: AlertType[] = ['follow', 'sub', 'donation', 'raid']
    const weights = [60, 25, 12, 3]
    const total = weights.reduce((a, b) => a + b, 0)
    let rand = Math.random() * total
    let type: AlertType = 'follow'
    for (let i = 0; i < types.length; i++) {
      rand -= weights[i]
      if (rand <= 0) { type = types[i]; break }
    }
    counts[type]++
    activeAlerts.value.push({ id: nextId++, type, message: templates[type](), time: now() })
    if (activeAlerts.value.length > 4) activeAlerts.value.shift()
  }, 2800)
})

onUnmounted(() => clearInterval(interval))

function alertColor(type: AlertType) {
  const map: Record<AlertType, string> = { follow: '#ff6b9d', sub: '#f39c12', donation: '#2ed573', raid: '#9b59f5' }
  return map[type]
}
function alertIcon(type: AlertType) {
  const map: Record<AlertType, string> = { follow: 'mdi-heart', sub: 'mdi-star', donation: 'mdi-cash', raid: 'mdi-lightning-bolt' }
  return map[type]
}
</script>

<style scoped>
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: 130px;
  overflow: hidden;
}
.alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid transparent;
}
.type-follow { border-color: #ff6b9d; }
.type-sub { border-color: #f39c12; }
.type-donation { border-color: #2ed573; }
.type-raid { border-color: #9b59f5; }
.alert-body { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.alert-title { font-size: 0.8rem; color: #e0e0f0; }
.alert-time { font-size: 0.7rem; color: rgba(200,200,224,0.35); }
.alert-counters {
  display: flex;
  gap: 1rem;
  margin-top: 0.6rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.counter-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  color: rgba(200,200,224,0.55);
}
.alert-pop-enter-active { transition: all 0.3s ease; }
.alert-pop-enter-from { opacity: 0; transform: translateY(-8px); }
.alert-pop-leave-active { transition: all 0.2s ease; }
.alert-pop-leave-to { opacity: 0; height: 0; }
</style>
