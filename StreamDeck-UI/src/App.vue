<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
</script>

<style>
* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

:root {
  --neon-purple: #9b59f5;
  --neon-cyan: #00f5ff;
  --bg-dark: #0a0a14;
  --surface: #12121f;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
}
</style>
