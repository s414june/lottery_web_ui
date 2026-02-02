<template>
  <main class="h-screen flex flex-col bg-white">
    <header class="p-2 bg-red-700">
      <p class="text-white font-bold">老祖宗保佑我</p>
    </header>
    <section class="flex flex-col justify-center items-center grow p-2">
      <router-view />
    </section>
  </main>
</template>
<script setup lang="ts">
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
