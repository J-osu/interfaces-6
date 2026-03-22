<template>
  <div class="widget-card" :class="{ 'widget-disabled': disabled }">
    <div class="widget-header">
      <v-icon :color="disabled ? 'grey' : 'secondary'" size="22">{{ icon }}</v-icon>
      <span class="widget-title">{{ title }}</span>
      <v-chip v-if="disabled" size="x-small" color="grey" variant="outlined">Sin soporte</v-chip>
      <div v-else class="widget-status-dot" />
    </div>
    <div class="widget-body">
      <slot />
    </div>
    <div v-if="disabled" class="disabled-overlay">
      <v-icon size="32" color="grey-lighten-1">mdi-lock-outline</v-icon>
      <span>No disponible</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  disabled?: boolean
}>()
</script>

<style scoped>
.widget-card {
  position: relative;
  background: rgba(18, 18, 31, 0.9);
  border: 1px solid rgba(155, 89, 245, 0.2);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.widget-card:not(.widget-disabled):hover {
  border-color: rgba(155, 89, 245, 0.45);
  box-shadow: 0 0 20px rgba(155, 89, 245, 0.12);
}
.widget-disabled {
  opacity: 0.45;
  border-color: rgba(255, 255, 255, 0.06);
  cursor: not-allowed;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}
.widget-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e8e8f0;
}
.widget-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2ed573;
  box-shadow: 0 0 6px #2ed573;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.widget-body {
  flex: 1;
  padding: 1rem;
  overflow: hidden;
}

.disabled-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(10, 10, 20, 0.5);
  backdrop-filter: blur(3px);
  font-size: 0.82rem;
  color: #9e9e9e;
  pointer-events: none;
}
</style>
