<template>
  <WidgetCard title="Chat en Vivo" icon="mdi-chat-processing">
    <div class="chat-messages">
      <div v-for="msg in messages" :key="msg.id" class="chat-msg">
        <span class="chat-user" :style="{ color: msg.color }">{{ msg.user }}</span>
        <span class="chat-text">{{ msg.text }}</span>
      </div>
    </div>
    <div class="chat-stats">
      <v-icon size="14" color="success">mdi-account-multiple</v-icon>
      <span>{{ viewerCount }} espectadores</span>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WidgetCard from './WidgetCard.vue'

interface ChatMessage {
  id: number
  user: string
  text: string
  color: string
}

const users = [
  { name: 'StreamFan99', color: '#9b59f5' },
  { name: 'NoobMaster', color: '#00f5ff' },
  { name: 'XxDarkxX', color: '#f39c12' },
  { name: 'GamerPro_', color: '#2ed573' },
  { name: 'LurkMode', color: '#ff6b9d' },
  { name: 'TwitchBot', color: '#888' },
]
const sampleTexts = [
  'GG! 🔥', 'increíble stream!', 'F', '😂', '¡Vamos vamos!',
  'PogChamp', 'no me lo esperaba xd', 'Subscribed! ❤️', 'LULW',
]
let nextId = 1

const messages = ref<ChatMessage[]>([
  { id: nextId++, user: 'StreamFan99', text: 'Hola, acabo de llegar!', color: '#9b59f5' },
  { id: nextId++, user: 'NoobMaster', text: 'GG ese movimiento!', color: '#00f5ff' },
  { id: nextId++, user: 'XxDarkxX', text: 'La calidad del stream está perfecta', color: '#f39c12' },
])
const viewerCount = ref(312)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    const u = users[Math.floor(Math.random() * users.length)]
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    messages.value.push({ id: nextId++, user: u.name, text, color: u.color })
    if (messages.value.length > 8) messages.value.shift()
    viewerCount.value += Math.floor(Math.random() * 5) - 2
  }, 1800)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  height: 140px;
  overflow: hidden;
}
.chat-msg {
  font-size: 0.82rem;
  line-height: 1.4;
}
.chat-user {
  font-weight: 700;
  margin-right: 0.3rem;
}
.chat-text { color: rgba(220, 220, 240, 0.85); }

.chat-stats {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.6rem;
  font-size: 0.75rem;
  color: rgba(200, 200, 224, 0.5);
}
</style>
