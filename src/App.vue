<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores/authStore';
import AppSidebar from './components/AppSidebar.vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <div v-if="isAuthenticated" class="relative flex">
    <AppSidebar />
    
    <main class="flex-1 ml-64">
      <RouterView />
    </main>
  </div>

  <div v-else>
    <RouterView />
  </div>
</template>

<style>
/* Style global bisa diletakkan di sini atau di style.css */
</style>