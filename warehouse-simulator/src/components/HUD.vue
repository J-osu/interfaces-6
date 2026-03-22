<script setup lang="ts">
defineProps<{
    score: number;
    time: number;
}>();

defineEmits(['restart']);
</script>

<template>
    <div class="hud-container">
        <div class="stats">
            <div class="stat-box">
                <span class="label">PUNTUACIÓN</span>
                <span class="value">{{ score }}</span>
            </div>
            <div class="stat-box">
                <span class="label">TIEMPO</span>
                <span class="value">{{ time }}s</span>
            </div>
        </div>
        
        <button class="restart-btn" @click="$emit('restart')">
            REINICIAR
        </button>
    </div>
</template>

<style scoped>
.hud-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    pointer-events: none; /* Let clicks pass through to game */
    z-index: 10;
}

.stats {
    display: flex;
    gap: 20px;
}

.stat-box {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(4px);
}

.label {
    font-size: 0.75rem;
    color: #88c0d0;
    font-weight: bold;
    letter-spacing: 1px;
}

.value {
    font-size: 1.5rem;
    color: #fff;
    font-weight: bold;
    font-family: monospace;
}

.restart-btn {
    pointer-events: auto; /* Enable clicks on button */
    background: #bf616a;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.restart-btn:hover {
    background: #d08770;
    transform: translateY(-2px);
}

.restart-btn:active {
    transform: translateY(0);
}
</style>
