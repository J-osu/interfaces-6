<script setup lang="ts">
import { ref } from 'vue';
import GameContainer from './components/GameContainer.vue';
import HUD from './components/HUD.vue';

const score = ref(0);
const time = ref(0);
let timerInterval: number | null = null;
const isPlaying = ref(false);

const startGame = () => {
    score.value = 0;
    time.value = 0;
    isPlaying.value = true;
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time.value++;
    }, 1000) as unknown as number;
};

const handleBoxCollected = () => {
    score.value++;
};

const handleRestart = () => {
    // Unmount and remount GameContainer to reset Phaser
    isPlaying.value = false;
    if (timerInterval) clearInterval(timerInterval);
    
    setTimeout(() => {
        startGame();
    }, 100);
};

// Start initially
startGame();
</script>

<template>
  <main class="app-container">
    <div class="simulator-wrapper">
        <HUD 
            :score="score" 
            :time="time" 
            @restart="handleRestart" 
        />
        <GameContainer 
            v-if="isPlaying"
            @box-collected="handleBoxCollected" 
        />
    </div>
  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #1a1a1a;
}

.simulator-wrapper {
  position: relative;
  width: 800px;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 2px solid #333;
}
</style>
