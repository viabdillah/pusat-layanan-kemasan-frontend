// src/stores/orderStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    activeOrder: null,
    loading: false,
    error: null,
  }),
  actions: {
    // Aksi untuk membuat pesanan baru
    async createOrder(orderPayload) { // Payload sekarang berisi { customerId, items }
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        // Kirim payload dengan struktur baru
        const response = await axios.post(`${API_BASE_URL}/orders`, orderPayload, config);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal membuat pesanan.';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async fetchQueue(role) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.get(`${API_BASE_URL}/orders/queue/${role}`, config);
        this.orders = response.data || []; // Pastikan orders adalah array
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || `Gagal memuat antrian ${role}.`;
        this.orders = []; // Kosongkan data jika error
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // Aksi untuk memperbarui status pesanan
    async updateOrderStatus(orderId, newStatus) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }, config);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal memperbarui status pesanan.';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async fetchMonitoringOrders() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.get(`${API_BASE_URL}/orders/monitoring`, config);
        this.orders = response.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal memuat data pemantauan.';
        this.orders = [];
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderById(orderId) {
      this.loading = true;
      this.error = null;
      this.activeOrder = null;
      const authStore = useAuthStore();
      if (!authStore.token) throw new Error('Tidak ada token otentikasi.');

      try {
        const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, config);
        this.activeOrder = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal memuat detail pesanan.';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },
  },
});