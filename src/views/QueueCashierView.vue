<script setup>
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/orderStore';

// Inisialisasi store
const orderStore = useOrderStore();

// Ambil state secara reaktif dari store
const { orders, loading, error } = storeToRefs(orderStore);

// Fungsi untuk memuat data saat komponen dibuka
const loadQueue = () => {
  // Panggil aksi fetchQueue dengan peran 'kasir'
  orderStore.fetchQueue('kasir');
};

// Panggil fungsi saat komponen pertama kali dimuat
onMounted(loadQueue);

onUnmounted(() => {
  orderStore.orders = [];
  orderStore.error = null;
});

// Fungsi untuk menangani penyelesaian pesanan
const handleCompleteOrder = async (orderId) => {
  // Minta konfirmasi dari pengguna
  const isConfirmed = confirm('Apakah Anda yakin ingin menyelesaikan pesanan ini? Tindakan ini tidak dapat diurungkan.');
  
  if (isConfirmed) {
    try {
      await orderStore.updateOrderStatus(orderId, 'selesai');
      alert('Pesanan berhasil diselesaikan!');
      // Muat ulang data antrian untuk menampilkan daftar terbaru
      loadQueue();
    } catch (err) {
      // Tampilkan pesan error jika gagal
      alert(`Error: ${err}`);
    }
  }
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Antrian Kasir (Menunggu Pembayaran)</h1>
    
    <div v-if="loading" class="mt-8 text-center text-gray-500">
      <p>Memuat data...</p>
    </div>

    <div v-else-if="error" class="mt-8 p-4 bg-red-100 text-red-700 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>
    
    <div v-else-if="orders && orders.length > 0" class="overflow-x-auto">
      <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr class="bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
              <th class="px-5 py-3 border-b-2 border-gray-200">ID Pesanan</th>
              <th class="px-5 py-3 border-b-2 border-gray-200">Pelanggan</th>
              <th class="px-5 py-3 border-b-2 border-gray-200">Produk</th>
              <th class="px-5 py-3 border-b-2 border-gray-200">Total Harga</th>
              <th class="px-5 py-3 border-b-2 border-gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">{{ order.orderId }}</td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">{{ order.customerName }}</td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">{{ order.productName }}</td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">Rp {{ order.totalPrice.toLocaleString('id-ID') }}</td>
              <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <button @click="handleCompleteOrder(order.id)" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                  Selesaikan Pembayaran
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="mt-8 text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
      <p class="font-semibold">Tidak ada pesanan</p>
      <p class="text-sm">Tidak ada pesanan yang menunggu pembayaran saat ini.</p>
    </div>
  </div>
</template>