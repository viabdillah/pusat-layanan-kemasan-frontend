<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const { user } = storeToRefs(authStore);

// PERBAIKAN DI SINI: Gunakan 'user.value?.role' (huruf 'r' kecil)
const userRole = computed(() => {
  return user.value?.role?.toLowerCase();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-xl font-bold">Pusat Layanan Kemasan</h1>
    </div>

<nav class="flex-grow p-4 space-y-2">
  <router-link to="/" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
    <span>Dashboard</span>
  </router-link>

  <div v-if="userRole === 'kasir' || userRole === 'admin'">
    <router-link to="/orders/new" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
      <span>Buat Pesanan Baru</span>
    </router-link>
    <router-link to="/queue/kasir" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
      <span>Antrian Kasir</span>
    </router-link>
  </div>

  <router-link v-if="userRole === 'designer' || userRole === 'admin'" to="/queue/designer" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
    <span>Antrian Desain</span>
  </router-link>

  <router-link v-if="userRole === 'operator' || userRole === 'admin'" to="/queue/operator" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
    <span>Antrian Produksi</span>
  </router-link>

  <router-link v-if="userRole === 'manajer' || userRole === 'admin'" to="/reports/sales" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
    <span>Laporan Penjualan</span>
  </router-link>
  
  <router-link v-if="userRole === 'admin'" to="/users" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-blue-600">
    <span>Manajemen Pengguna</span>
  </router-link>
</nav>

    <div class="p-4 border-t border-gray-700">
      <div v-if="user">
        <p class="font-semibold">{{ user.name }}</p>
        <p class="text-sm text-gray-400 capitalize">{{ user.role }}</p>
        <button @click="handleLogout" class="w-full mt-4 text-left px-4 py-2 rounded-md text-sm bg-red-500 hover:bg-red-600 transition-colors">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>