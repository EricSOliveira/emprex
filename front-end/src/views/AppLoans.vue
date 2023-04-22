<script lang="ts" setup>
import { useAuthStore } from '../stores/auth'

const { logout } = useAuthStore()
</script>

<template>
  <main>
    <LoansList />
    <v-btn @click="logout" class="mt-6"> Sair </v-btn>
  </main>
</template>
