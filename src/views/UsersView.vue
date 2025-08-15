<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';

// Inisialisasi store
const userStore = useUserStore();

// Ambil state secara reaktif dari store
const { users, loading, error } = storeToRefs(userStore);

// Panggil aksi fetchUsers saat komponen pertama kali dimuat
onMounted(() => {
  userStore.fetchUsers();
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
    
    <div v-if="loading" class="mt-8 text-center text-gray-500">
      <p>Memuat data pengguna...</p>
    </div>

    <div v-else-if="error" class="mt-8 p-4 bg-red-100 text-red-700 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>
    
    <div v-else class="mt-6 overflow-x-auto">
      <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Nama
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Email
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Role
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Tanggal Bergabung
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.ID" class="hover:bg-gray-50">
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ user.Name }}</p>
              </td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ user.Email }}</p>
              </td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <span :class="user.Role === 'admin' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'" class="px-2 py-1 font-semibold leading-tight rounded-full text-xs">
                  {{ user.Role }}
                </span>
              </td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ new Date(user.CreatedAt).toLocaleDateString('id-ID') }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>