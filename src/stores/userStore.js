// src/stores/userStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

// Menggunakan variabel environment, dengan fallback ke alamat Go backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL = `${API_BASE_URL}/users`;

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],          // Untuk menyimpan daftar pengguna
    loading: false,     // Untuk status loading
    error: null,        // Untuk menyimpan pesan error
  }),

  actions: {
    // Aksi untuk mengambil semua pengguna dari backend
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Tidak ada token otentikasi.';
        this.loading = false;
        return;
      }

      try {
        // Siapkan header dengan token otentikasi
        const config = {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        };

        // Lakukan permintaan GET ke API Go kita
        const response = await axios.get(API_URL, config);
        
        // Simpan data ke state
        this.users = response.data;

      } catch (err) {
        // Tangani error
        this.error = err.response?.data?.message || err.response?.data?.error || 'Gagal memuat data pengguna.';
        console.error("Error fetching users:", err);
      } finally {
        // Hentikan status loading, apa pun hasilnya
        this.loading = false;
      }
    },
  },
});