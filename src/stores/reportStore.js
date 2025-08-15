// src/stores/reportStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useReportStore = defineStore('reports', {
  state: () => ({
    summary: null,
    loading: false,
    error: null,
  }),
  actions: {
    // Aksi untuk mengambil ringkasan (sudah ada)
    async fetchSalesSummary(period = 'monthly') {
      this.loading = true;
      this.error = null;
      this.summary = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.get(`${API_BASE_URL}/reports/sales-summary?period=${period}`, config);
        this.summary = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal memuat laporan.';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // --- AKSI BARU UNTUK EKSPOR KE EXCEL ---
    async exportSalesSummary(period = 'monthly') {
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = {
          headers: { Authorization: `Bearer ${authStore.token}` },
          responseType: 'blob', // Penting: minta Axios untuk menerima data sebagai file
        };
        const response = await axios.get(`${API_BASE_URL}/reports/sales-summary/export?period=${period}`, config);

        // Buat URL sementara untuk file blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const fileName = `Laporan-Penjualan-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.setAttribute('download', fileName);
        
        // Klik link secara virtual untuk memulai unduhan
        document.body.appendChild(link);
        link.click();
        
        // Hapus link setelah selesai
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (err) {
        console.error('Gagal mengunduh laporan:', err);
        alert('Gagal mengunduh laporan. Lihat console untuk detail.');
      }
    },
  },
});