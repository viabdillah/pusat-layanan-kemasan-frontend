// src/stores/customerStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [], // Untuk hasil pencarian
    loading: false,
    error: null,
  }),
  actions: {
    async searchCustomers(searchTerm) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.get(`${API_BASE_URL}/customers?search=${searchTerm}`, config);
        this.customers = response.data;
      } catch (error) { // Kita gunakan nama 'error' agar lebih jelas
        this.error = 'Gagal mencari pelanggan.';
        this.customers = [];
        // DENGAN MENAMBAHKAN BARIS INI, VARIABELNYA JADI TERPAKAI:
        console.error('Terjadi kesalahan saat mencari pelanggan:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});