<template>
  <v-app>
    <BaggageDashboard @update:filter="filterState = $event" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaggageDashboard from './components/BaggageDashboard.vue'
import { useDashboardTour } from './composables/useDashboardTour'
import './styles/shepherd-theme.css'

// State locally tracked to pass into the composable
const filterState = ref<'all' | 'delayed' | 'ontime'>('all')

// Llamada síncrona en el root del setup para permitir el uso de inject() de vue-shepherd
const { startTour } = useDashboardTour(filterState)

onMounted(() => {
  // Iniciar con un pequeñísimo retardo para dar tiempo al DOM
  setTimeout(() => {
    startTour()
  }, 500)
})
</script>

<style>
/* Reset base */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.v-application {
  background-color: transparent !important;
}
</style>
