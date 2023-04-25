<script lang="ts" setup>
import { useAuthStore } from '../stores/auth'

const { logout } = useAuthStore()

const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  await logout()
  loading.value = false
}
</script>

<template>
  <main>
    <LoansList />
    <v-btn @click="handleLogout" class="mt-6" :loading="loading"> Sair </v-btn>
  </main>
</template>
