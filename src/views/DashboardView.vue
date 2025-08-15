<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';

const authStore = useAuthStore();
const orderStore = useOrderStore();

const { user } = storeToRefs(authStore);
// Kita ganti nama 'orders' menjadi 'monitoringOrders' agar lebih jelas
const { orders: monitoringOrders, loading, error } = storeToRefs(orderStore);

// Mengelompokkan pesanan berdasarkan statusnya
const ordersByStatus = computed(() => {
  const grouped = {};
  for (const order of monitoringOrders.value) {
    if (!grouped[order.status]) {
      grouped[order.status] = [];
    }
    grouped[order.status].push(order);
  }
  return grouped;
});

// Urutan kolom status di papan Kanban
const statusColumns = ['menunggu_desain', 'proses_desain', 'menunggu_produksi', 'proses_produksi', 'menunggu_pembayaran'];

onMounted(() => {
  // Hanya ambil data monitoring jika user adalah manajer atau admin
  const userRole = user.value?.role?.toLowerCase();
  if (userRole === 'manajer' || userRole === 'admin') {
    orderStore.fetchMonitoringOrders();
  }
});

// Bersihkan state saat halaman ditinggalkan
onUnmounted(() => {
  orderStore.orders = [];
  orderStore.error = null;
});
</script>

<template>
  <div class="p-8">
    <div v-if="user && (user.role.toLowerCase() === 'manajer' || user.role.toLowerCase() === 'admin')">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Pemantauan Proses Pesanan Langsung</h1>
      
      <div v-if="loading" class="text-center text-gray-500">Memuat data...</div>
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md"><strong>Error:</strong> {{ error }}</div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div v-for="status in statusColumns" :key="status" class="bg-gray-100 rounded-lg">
          <h2 class="font-bold text-gray-700 p-3 border-b capitalize">{{ status.replace('_', ' ') }} ({{ ordersByStatus[status]?.length || 0 }})</h2>
          <div class="p-3 space-y-3 overflow-y-auto" style="max-height: 70vh;">
            <div v-if="ordersByStatus[status] && ordersByStatus[status].length > 0">
              <div v-for="order in ordersByStatus[status]" :key="order.id" class="bg-white p-4 rounded-md shadow">
                <p class="font-semibold text-sm text-blue-600">{{ order.orderId }}</p>
                
                <p class="text-gray-800 font-bold">{{ order.customerInfo?.name || 'Data Pelanggan Hilang' }}</p>

                <p class="text-sm text-gray-600">
                  {{ order.items?.[0]?.productName || '(Tidak ada item)' }}
                  <span v-if="order.items?.length > 1"> (+{{ order.items.length - 1 }} item lain)</span>
                </p>

                <p class="text-xs text-gray-400 mt-2">Update: {{ new Date(order.updatedAt).toLocaleString('id-ID') }}</p>
              </div>
            </div>
            <div v-else class="p-4 text-center text-sm text-gray-400">
              Kosong
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ user?.name }}!</h1>
      <p class="text-gray-600">Anda telah login sebagai: <span class="font-semibold capitalize text-blue-600">{{ user?.role }}</span></p>
    </div>
  </div>
</template>