// src/stores/authStore.js

import { defineStore } from 'pinia'
import axios from 'axios'

// Definisikan URL base dari API backend kita
// Gunakan variabel dari .env, dengan fallback jika tidak ada
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL = `${API_BASE_URL}/users`;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Coba ambil data dari localStorage saat store pertama kali dibuat
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
  }),

  getters: {
    // Getter untuk memeriksa apakah pengguna sudah login
    isAuthenticated: (state) => !!state.token && !!state.user,
    // Getter untuk memeriksa apakah pengguna adalah admin
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    // Aksi untuk REGISTRASI
    async register(userData) {
      // Hapus token lama jika ada
      this.logout();
      
      const response = await axios.post(`${API_URL}/register`, userData);
      const data = response.data;

      // Simpan data ke state dan localStorage
      this.user = { _id: data._id, name: data.name, email: data.email, role: data.role };
      this.token = data.token;
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
    },

    // Aksi untuk LOGIN
    async login(userData) {
      this.logout();

      const response = await axios.post(`${API_URL}/login`, userData);
      const data = response.data;
      
      this.user = { _id: data._id, name: data.name, email: data.email, role: data.role };
      this.token = data.token;
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
    },

    // Aksi untuk LOGOUT
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});