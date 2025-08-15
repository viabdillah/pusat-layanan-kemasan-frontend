<script setup>
import { onMounted, ref, computed } from 'vue'; // <-- PERBAIKAN DI SINI
import { storeToRefs } from 'pinia';
import { useReportStore } from '@/stores/reportStore';
import VueApexCharts from 'vue3-apexcharts';

const reportStore = useReportStore();
const { summary, loading, error, chartData } = storeToRefs(reportStore);

const selectedPeriod = ref('monthly');
const periods = [
  { label: 'Harian', value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan', value: 'monthly' },
  { label: 'Tahunan', value: 'yearly' },
];

const exportLoading = ref(false);

const loadReport = () => {
  reportStore.fetchSalesSummary(selectedPeriod.value);
  reportStore.fetchSalesChartData(selectedPeriod.value);
};

const handlePeriodChange = (periodValue) => {
  selectedPeriod.value = periodValue;
  loadReport();
};

const handleExport = async () => {
  exportLoading.value = true;
  await reportStore.exportSalesSummary(selectedPeriod.value);
  exportLoading.value = false;
};

onMounted(loadReport);

const chartSeries = computed(() => [
  {
    name: 'Pendapatan',
    data: chartData.value.map(item => item.totalRevenue),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 350,
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  xaxis: {
    type: 'datetime',
    categories: chartData.value.map(item => item._id),
  },
  yaxis: {
    labels: {
      formatter: (val) => `Rp ${val ? val.toLocaleString('id-ID') : 0}`, // Pengaman jika val null
    },
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' },
    y: {
      formatter: (val) => `Rp ${val ? val.toLocaleString('id-ID') : 0}`, // Pengaman jika val null
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100],
    },
  },
}));
</script>

<template>
  <div class="p-8">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
        <p class="text-gray-600">Ringkasan pendapatan dan pesanan yang telah selesai.</p>
      </div>
      <button 
        @click="handleExport" 
        :disabled="exportLoading"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition duration-200 disabled:bg-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        {{ exportLoading ? 'Mengunduh...' : 'Unduh Excel' }}
      </button>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button 
        v-for="period in periods" 
        :key="period.value" 
        @click="handlePeriodChange(period.value)"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border'
        ]">
        {{ period.label }}
      </button>
    </div>
    
    <div v-if="loading" class="text-center text-gray-500">Memuat data laporan...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
      <strong>Error:</strong> {{ error }}
    </div>
    
    <div v-else-if="summary" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div class="bg-green-500 text-white p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Pendapatan ({{ selectedPeriod }})</p>
            <p class="text-3xl font-bold text-gray-800">Rp {{ summary.totalRevenue.toLocaleString('id-ID') }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div class="bg-blue-500 text-white p-4 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4m0-14L4 7" /></svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Pesanan Selesai ({{ selectedPeriod }})</p>
            <p class="text-3xl font-bold text-gray-800">{{ summary.totalOrders }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
         <h2 class="text-lg font-semibold text-gray-700">Grafik Pendapatan ({{ selectedPeriod }})</h2>
         <div v-if="!loading && chartData.length > 0" id="chart">
           <VueApexCharts type="area" height="350" :options="chartOptions" :series="chartSeries"></VueApexCharts>
         </div>
         <div v-else-if="!loading && chartData.length === 0" class="text-center py-16 text-gray-500">
           Tidak ada data penjualan untuk ditampilkan pada periode ini.
         </div>
      </div>
    </div>
  </div>
</template>