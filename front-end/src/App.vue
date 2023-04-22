<script setup lang="ts">
import { watch, computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../src/stores/auth'

const { token } = useAuthStore()
const router = useRouter()

const notHaveToken = (token: string) => {
  const updateToken = computed(() => unauthenticated.includes(token))
  const unauthenticated = ['', null, undefined]
  if (updateToken.value) router.push('/')
}

watch(
  () => token,
  (newToken) => {
    notHaveToken(newToken)
  },
  { immediate: true }
)
</script>

<template>
  <router-view />
</template>
