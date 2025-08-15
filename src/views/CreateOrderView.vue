<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import { useCustomerStore } from '@/stores/customerStore';
import { debounce } from 'lodash-es';

const orderStore = useOrderStore();
const customerStore = useCustomerStore();
const router = useRouter();

// State untuk formulir
const selectedCustomer = ref(null);
const customerSearch = ref('');
const items = ref([
  { productName: '', brand: '', label: '', size: '', quantity: 1, pricePerPiece: 0, hasDesign: false }
]);

const feedbackMessage = ref(null);
const isLoading = ref(false);

// Fungsi untuk menambah item baru ke pesanan
const addItem = () => {
  items.value.push({ productName: '', brand: '', label: '', size: '', quantity: 1, pricePerPiece: 0, hasDesign: false });
};

// Fungsi untuk menghapus item dari pesanan
const removeItem = (index) => {
  items.value.splice(index, 1);
};

// Fungsi untuk memilih pelanggan dari hasil pencarian
const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  customerSearch.value = customer.Name;
  customerStore.customers = []; // Kosongkan hasil pencarian
};

// Gunakan 'watch' dan 'debounce' untuk melakukan pencarian setelah user berhenti mengetik
watch(customerSearch, debounce((newQuery) => {
  if (newQuery && (!selectedCustomer.value || newQuery !== selectedCustomer.value.Name)) {
    customerStore.searchCustomers(newQuery);
  } else {
    customerStore.customers = [];
  }
}, 500)); // Tunggu 500ms setelah user berhenti mengetik

const handleSubmit = async () => {
  if (!selectedCustomer.value) {
    alert('Harap pilih pelanggan terlebih dahulu.');
    return;
  }
  
  isLoading.value = true;
  feedbackMessage.value = null;

  const payload = {
    customerId: selectedCustomer.value.id,
    items: items.value,
  };

  try {
    const newOrder = await orderStore.createOrder(payload);
    feedbackMessage.value = { type: 'success', text: `Pesanan ${newOrder.OrderId} berhasil dibuat!` };
    setTimeout(() => router.push('/'), 1500); // Redirect ke dashboard setelah sukses
  } catch (error) {
    feedbackMessage.value = { type: 'error', text: `Gagal: ${error}` };
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Buat Pesanan Baru</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Informasi Pelanggan</h2>
        <div class="mt-4 relative">
          <label for="customerSearch" class="block text-sm font-medium text-gray-700">Cari Pelanggan</label>
          <input type="text" id="customerSearch" v-model="customerSearch" @focus="selectedCustomer = null" placeholder="Ketik nama pelanggan..." class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          
          <ul v-if="customerStore.customers.length > 0" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
            <li v-for="customer in customerStore.customers" :key="customer.id" @click="selectCustomer(customer)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {{ customer.Name }}
            </li>
          </ul>
          
          <div v-if="selectedCustomer" class="mt-4 p-4 bg-gray-50 border rounded-md">
            <h3 class="font-semibold text-gray-800">Detail Pelanggan Dipilih:</h3>
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
              <p><span class="font-medium">Nama:</span> {{ selectedCustomer.name }}</p>
              <p><span class="font-medium">Telepon:</span> {{ selectedCustomer.phoneNumber || '-' }}</p>
              <p><span class="font-medium">No. PIRT:</span> {{ selectedCustomer.pirtNumber || '-' }}</p>
              <p><span class="font-medium">No. Halal:</span> {{ selectedCustomer.halalNumber || '-' }}</p>
              <p class="col-span-full"><span class="font-medium">Alamat:</span> {{ selectedCustomer.address || '-' }}</p>
              <p><span class="font-medium">No. BPOM:</span> {{ selectedCustomer.bpomNumber || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Item Pesanan</h2>
        
        <div v-for="(item, index) in items" :key="index" class="mt-4 p-4 border rounded-md relative">
          <button type="button" v-if="items.length > 1" @click="removeItem(index)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">X</button>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="item.productName" placeholder="Nama Produk" required class="form-input">
            <input v-model="item.brand" placeholder="Merk" class="form-input">
            <input v-model="item.label" placeholder="Label" class="form-input">
            <input v-model="item.size" placeholder="Ukuran" class="form-input">
            <input v-model.number="item.quantity" type="number" min="1" placeholder="Jumlah" required class="form-input">
            <input v-model.number="item.pricePerPiece" type="number" min="0" placeholder="Harga per Pcs" required class="form-input">
            <div class="flex items-center">
              <input :id="`hasDesign-${index}`" v-model="item.hasDesign" type="checkbox" class="form-checkbox">
              <label :for="`hasDesign-${index}`" class="ml-2">Desain Sudah Ada?</label>
            </div>
          </div>
        </div>

        <button type="button" @click="addItem" class="mt-4 py-2 px-4 border border-dashed rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
          + Tambah Produk Lain
        </button>
      </div>

      <div>
        <button type="submit" :disabled="isLoading || !selectedCustomer" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
          {{ isLoading ? 'Menyimpan...' : 'Buat Pesanan' }}
        </button>
      </div>
      
      <div v-if="feedbackMessage" class="p-4 rounded-md" :class="feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        <p>{{ feedbackMessage.text }}</p>
      </div>
    </form>
  </div>
</template>

<style scoped lang="postcss">
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
.form-checkbox {
  @apply h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
}
</style>