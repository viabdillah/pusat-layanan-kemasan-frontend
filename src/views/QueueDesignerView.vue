<script setup>
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();
const { orders, loading, error } = storeToRefs(orderStore);

const loadQueue = () => {
  // Gunakan kembali aksi 'fetchQueue' dengan peran 'designer'
  orderStore.fetchQueue('designer');
};

onMounted(loadQueue);

onUnmounted(() => {
  orderStore.orders = [];
  orderStore.error = null;
});

// Fungsi untuk memperbarui status pesanan
const handleUpdateStatus = async (orderId, newStatus) => {
  const statusMap = {
    proses_desain: 'memulai pengerjaan desain',
    menunggu_produksi: 'menyelesaikan desain dan mengirim ke produksi',
  };
  const confirmation = confirm(`Apakah Anda yakin ingin ${statusMap[newStatus]} untuk pesanan ini?`);
  
  if (confirmation) {
    try {
      await orderStore.updateOrderStatus(orderId, newStatus);
      alert('Status pesanan berhasil diperbarui!');
      loadQueue(); // Muat ulang antrian
    } catch (err) {
      alert(`Error: ${err}`);
    }
  }
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Antrian Desain</h1>
    
    <div v-if="loading" class="text-center text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
      <strong>Error:</strong> {{ error }}
    </div>
    
    <div v-else-if="orders && orders.length > 0" class="overflow-x-auto">
      <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr class="bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
              <th class="px-5 py-3">ID Pesanan</th>
              <th class="px-5 py-3">Pelanggan</th>
              <th class="px-5 py-3">Detail Produk</th>
              <th class="px-5 py-3">Status Saat Ini</th>
              <th class="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 border-b border-gray-200">
              <td class="px-5 py-4 bg-white text-sm">{{ order.orderId }}</td>
              <td class="px-5 py-4 bg-white text-sm">{{ order.customerName }}</td>
              <td class="px-5 py-4 bg-white text-sm">
                <div v-if="order.items && order.items.length > 0">
                  <p class="font-semibold">{{ order.items[0].productName }}</p>
                  <p class="text-gray-600">Label: {{ order.items[0].label || '-' }} | Ukuran: {{ order.items[0].size || '-' }}</p>
                </div>
              </td>
              <td class="px-5 py-4 bg-white text-sm">
                <span class="px-2 py-1 font-semibold leading-tight rounded-full text-xs"
                      :class="{ 'bg-yellow-200 text-yellow-800': order.status === 'menunggu_desain', 'bg-blue-200 text-blue-800': order.status === 'proses_desain' }">
                  {{ order.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-5 py-4 bg-white text-sm">
                <button v-if="order.status === 'menunggu_desain'" @click="handleUpdateStatus(order.id, 'proses_desain')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                  Mulai Kerjakan
                </button>
                <button v-if="order.status === 'proses_desain'" @click="handleUpdateStatus(order.id, 'menunggu_produksi')" class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md">
                  Selesai & Kirim ke Produksi
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="mt-8 text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
      <p class="font-semibold">Antrian Kosong</p>
      <p class="text-sm">Tidak ada pesanan yang membutuhkan pekerjaan desain saat ini.</p>
    </div>
  </div>
</template>