<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/orderStore';

const route = useRoute();
const orderStore = useOrderStore();
const { activeOrder: order, loading, error } = storeToRefs(orderStore);

onMounted(() => {
  const orderId = route.params.id;
  orderStore.fetchOrderById(orderId);
});
</script>

<template>
  <div class="p-8">
    <div v-if="loading">Memuat detail pesanan...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">Error: {{ error }}</div>
    
    <div v-else-if="order" class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-800">Detail Pesanan: {{ order.orderId }}</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold border-b pb-2">Informasi Pelanggan</h2>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <p><strong>Nama:</strong> {{ order.customerInfo?.name }}</p>
          <p><strong>Telepon:</strong> {{ order.customerInfo?.phoneNumber || '-' }}</p>
          <p class="col-span-2"><strong>Alamat:</strong> {{ order.customerInfo?.address || '-' }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold border-b pb-2">Item Produk</h2>
        <div class="mt-4 space-y-4">
          <div v-for="(item, index) in order.items" :key="index" class="p-4 border rounded-md">
            <p class="font-bold">{{ item.productName }}</p>
            <ul class="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>Jumlah: {{ item.quantity }} pcs</li>
              <li>Harga/pcs: Rp {{ item.pricePerPiece.toLocaleString('id-ID') }}</li>
              <li>Ukuran: {{ item.size || '-' }}</li>
              <li>Merk: {{ item.brand || '-' }}</li>
              <li>Desain Sudah Ada: {{ item.hasDesign ? 'Ya' : 'Tidak' }}</li>
            </ul>
          </div>
        </div>
      </div>
       <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold border-b pb-2">Status & Biaya</h2>
        <div class="mt-4 grid grid-cols-2 gap-4">
            <p><strong>Status Saat Ini:</strong> <span class="font-bold capitalize">{{ order.status.replace('_', ' ') }}</span></p>
            <p class="text-xl font-bold"><strong>Total Biaya:</strong> Rp {{ order.totalPrice.toLocaleString('id-ID') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>