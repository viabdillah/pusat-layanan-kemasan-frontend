# 📊 Dasbor Pusat Layanan Kemasan - Frontend (Vue.js)

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-2-FFB85F?style=for-the-badge&logo=pinia)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)

Ini adalah antarmuka pengguna (UI) untuk aplikasi **Pusat Layanan Kemasan**. Dibangun sebagai *Single Page Application* (SPA) yang modern dan reaktif menggunakan Vue.js 3, aplikasi ini menyediakan dasbor yang dinamis dan sadar-peran (*role-aware*) untuk mengelola seluruh alur kerja bisnis.

---

## 🌐 Demo Langsung

*Link ke aplikasi yang sudah di-deploy akan tersedia di sini setelah kita melakukan deployment ke Vercel.*
`[LINK-BELUM-TERSEDIA-WKWKW]`

---

## ✨ Fitur Utama

-   🎨 **Antarmuka Dinamis Berbasis Peran:** Tampilan dan menu navigasi secara otomatis menyesuaikan diri berdasarkan peran pengguna yang login (Admin, Manajer, Kasir, dll).
-   ⚡ **Pengalaman Pengguna yang Reaktif:** Dibangun dengan Vue 3 Composition API dan Vite untuk performa yang sangat cepat dan *hot-reloads* instan saat pengembangan.
-   🍍 **Manajemen State Terpusat:** Menggunakan Pinia untuk mengelola status otentikasi, data pengguna, dan data bisnis di seluruh aplikasi secara konsisten.
-   🔒 **Rute yang Dilindungi:** Menggunakan Vue Router *Navigation Guards* untuk mengamankan halaman dan memastikan hanya pengguna dengan peran yang sesuai yang dapat mengaksesnya.
-   📝 **Formulir Interaktif:** Komponen formulir dinamis untuk membuat pesanan multi-item, lengkap dengan fitur pencarian pelanggan secara *real-time*.
-   📱 **Desain Responsif:** Didesain dengan Tailwind CSS dengan pendekatan *mobile-first* agar terlihat dan berfungsi dengan baik di semua perangkat, dari ponsel hingga desktop.
-   📊 **Visualisasi Data:** Halaman laporan untuk manajer menampilkan ringkasan data bisnis dalam format kartu statistik yang mudah dibaca.

---

## 🛠️ Teknologi yang Digunakan

-   **Framework:** [Vue.js](https://vuejs.org/) (v3, Composition API & `<script setup>`)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Routing:** [Vue Router](https://router.vuejs.org/)
-   **State Management:** [Pinia](https://pinia.vuejs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Code Quality:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)
-   **Library Tambahan:** [lodash-es](https://lodash.com/)

---

## ⚙️ Cara Menjalankan Secara Lokal

1.  **Prasyarat:** Pastikan Anda memiliki [Node.js](https://nodejs.org/) versi 18+ terinstal.

2.  **Clone Repositori**
    ```bash
    git clone [https://github.com/NAMA_ANDA/pusat-layanan-kemasan-frontend-vue.git](https://github.com/NAMA_ANDA/pusat-layanan-kemasan-frontend-vue.git)
    cd pusat-layanan-kemasan-frontend-vue
    ```

3.  **Instal Dependensi**
    ```bash
    npm install
    ```

4.  **Siapkan Variabel Lingkungan**
    Buat file bernama `.env` di direktori utama dan isi dengan alamat API backend Anda:
    ```.env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

5.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka browser dan kunjungi `http://localhost:5173`.

---

## 🚀 Rencana Pengembangan

-   [ ] **Langkah 30:** Membuat Halaman Detail Pesanan.
-   [ ] **Langkah 31:** Menambahkan Grafik & Bagan pada Halaman Laporan.
-   [ ] **Langkah 32:** Membangun Sistem Notifikasi Dasar.
-   [ ] Komponen *pop-up* (modal) untuk konfirmasi aksi.
-   [ ] Fungsionalitas UI penuh untuk Manajemen Pelanggan (CRUD).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://choosealicense.com/licenses/mit/).
