<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 1. Impor useRouter
import { useAuthStore } from '@/stores/authStore' // 2. Impor auth store kita

const router = useRouter() // 3. Inisialisasi router
const authStore = useAuthStore() // 4. Inisialisasi store

// ... (ref untuk loginData, registerData, isRegistering tidak berubah)
const loginData = ref({ email: '', password: '' })
const registerData = ref({ name: '', email: '', password: '' })
const isRegistering = ref(false)

// State untuk menampilkan pesan error
const errorMessage = ref(null)

const handleLogin = async () => {
  errorMessage.value = null; // Reset pesan error
  try {
    await authStore.login(loginData.value);
    router.push('/'); // Arahkan ke dashboard jika berhasil
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat login';
  }
}

const handleRegister = async () => {
  errorMessage.value = null; // Reset pesan error
  try {
    await authStore.register(registerData.value);
    router.push('/'); // Arahkan ke dashboard jika berhasil
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ isRegistering ? 'Buat akun baru' : 'Login ke akun Anda' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

        <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4">
            <div class="flex">
                <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                </div>
            </div>
        </div>
                
        <Transition name="form-fade" mode="out-in">
          <form v-if="!isRegistering" key="login-form" class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Alamat Email </label>
              <div class="mt-1">
                <input v-model="loginData.email" id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
              <div class="mt-1">
                <input v-model="loginData.password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Login
              </button>
            </div>
          </form>

          <form v-else key="register-form" class="space-y-6" @submit.prevent="handleRegister">
             <div>
              <label for="name-reg" class="block text-sm font-medium text-gray-700"> Nama Lengkap </label>
              <div class="mt-1">
                <input v-model="registerData.name" id="name-reg" name="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="email-reg" class="block text-sm font-medium text-gray-700"> Alamat Email </label>
              <div class="mt-1">
                <input v-model="registerData.email" id="email-reg" name="email" type="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="password-reg" class="block text-sm font-medium text-gray-700"> Password </label>
              <div class="mt-1">
                <input v-model="registerData.password" id="password-reg" name="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Daftar
              </button>
            </div>
          </form>
        </Transition>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500"> Atau </span>
            </div>
          </div>
          <div class="mt-6 text-center">
            <button @click="isRegistering = !isRegistering" class="font-medium text-blue-600 hover:text-blue-500">
              {{ isRegistering ? 'Login ke akun yang sudah ada' : 'Buat akun baru' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Kelas-kelas untuk transisi 'form-fade' */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.25s ease-in-out;
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>