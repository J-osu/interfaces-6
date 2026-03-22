<template>
  <WidgetCard title="Vista de Cámara" icon="mdi-webcam">
    <div class="camera-view">
      <div class="camera-feed">
        <!-- Simulated camera feed with scanning animation -->
        <div class="scan-line" />
        <div class="camera-overlay">
          <div class="rec-badge">
            <span class="rec-dot" />
            REC
          </div>
          <div class="camera-info">
            <span>1920×1080</span>
            <span>60fps</span>
          </div>
        </div>
        <div class="corner tl" />
        <div class="corner tr" />
        <div class="corner bl" />
        <div class="corner br" />
      </div>
      <div class="camera-controls">
        <v-btn icon size="x-small" variant="tonal" color="secondary">
          <v-icon size="16">mdi-television-play</v-icon>
        </v-btn>
        <v-btn icon size="x-small" variant="tonal" color="secondary">
          <v-icon size="16">mdi-crop</v-icon>
        </v-btn>
        <v-btn icon size="x-small" variant="tonal" color="error">
          <v-icon size="16">mdi-remote</v-icon>
        </v-btn>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
import WidgetCard from './WidgetCard.vue'
</script>

<style scoped>
.camera-view { display: flex; flex-direction: column; gap: 0.6rem; }
.camera-feed {
  position: relative;
  height: 110px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0c0c1e 0%, #1a1a30 50%, #0c0c1e 100%);
  border: 1px solid rgba(0, 245, 255, 0.15);
  overflow: hidden;
}
.scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.6), transparent);
  animation: scan 2.5s ease-in-out infinite;
}
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
.camera-overlay {
  position: absolute;
  inset: 0;
  padding: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.rec-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #ff4757;
  letter-spacing: 0.5px;
}
.rec-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #ff4757;
  animation: blink 1s ease infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.camera-info {
  display: flex;
  gap: 0.4rem;
  font-size: 0.6rem;
  color: rgba(0, 245, 255, 0.7);
  font-family: 'Courier New', monospace;
}
.corner {
  position: absolute;
  width: 10px; height: 10px;
  border-color: rgba(0, 245, 255, 0.5);
  border-style: solid;
}
.tl { top: 4px; left: 4px; border-width: 1px 0 0 1px; }
.tr { top: 4px; right: 4px; border-width: 1px 1px 0 0; }
.bl { bottom: 4px; left: 4px; border-width: 0 0 1px 1px; }
.br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }
.camera-controls {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}
</style>
