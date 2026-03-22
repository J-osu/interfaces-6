<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { StartGame } from '../game/config';
import { EventBus } from '../game/EventBus';

// Emit events to the parent App
const emit = defineEmits(['box-collected']);
const gameContainer = ref<HTMLElement | null>(null);
let gameInstance: Phaser.Game | null = null;

onMounted(() => {
    if (gameContainer.value) {
        gameInstance = StartGame('game-container');
    }
    
    // Listen to Phaser event and emit to Vue
    EventBus.on('box-collected', () => {
        emit('box-collected');
    });
});

onUnmounted(() => {
    EventBus.off('box-collected');
    if (gameInstance) {
        // Destroy the game instance to free memory and avoid zombie processes
        gameInstance.destroy(true);
        gameInstance = null;
    }
});
</script>

<template>
    <div id="game-container" ref="gameContainer"></div>
</template>

<style scoped>
#game-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
