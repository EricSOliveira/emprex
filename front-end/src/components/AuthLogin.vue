<script lang="ts" setup>
import { onMounted, computed, ref, watch, toRaw } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const { login, register } = useAuthStore()
const router = useRouter()

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    email(value: string) {
      const regex = /([a-z0-9_\\.-]+)@([\da-z\\.-]+)\.([a-z\\.]{2,6})$/
      if (regex.test(value)) return true

      return 'Email inválido.'
    },
    password(value: string) {
      if (value?.length >= 8) return true

      return 'A senha deve conter no mínimo 8 caracteres.'
    }
  }
})

const email = useField('email')
const password = useField('password')
const show1 = ref(false)
const step = ref('signIn')
const description = ref({
  title: '',
  span: '',
  btn: ''
})

onMounted(() => {
  email.value.value = 'contato.ericoliveira+22@gmail.com'
  password.value.value = 'Teste@123'
})

const submit = handleSubmit(async (values) => {
  const token: any =
    step.value === 'signIn'
      ? await login(values.email, values.password)
      : await register(values.email, values.password)

  authenticate(toRaw(token.value))
})

const authenticate = (token: any) => {
  const unauthenticated = ['', null, undefined]
  const updateToken = computed(() => unauthenticated.includes(token))

  if (!updateToken.value) router.push('/loans')
}

watch(
  () => step.value,
  (newVal) => {
    if (newVal === 'signIn') {
      description.value.title = 'Login'
      description.value.span = 'Não tem cadastor? Cadastre-se aqui.'
      description.value.btn = 'Entrar'
    } else {
      description.value.title = 'Cadastro'
      description.value.span = 'Já tem login? Logue aqui.'
      description.value.btn = 'Cadastrar'
    }

    handleReset()
  },
  { immediate: true }
)
</script>

<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-[2rem] font-[600]">{{ description.title }}</h1>
    <form @submit.prevent="submit">
      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        label="E-mail"
        class="mt-6"
      ></v-text-field>

      <div class="relative">
        <span
          @click="step = step === 'signIn' ? 'signUp' : 'signIn'"
          class="absolute text-[12px] cursor-pointer top-0 right-0"
        >
          {{ description.span }}
        </span>
        <br />
        <v-text-field
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          v-model="password.value.value"
          counter
          :error-messages="password.errorMessage.value"
          label="Senha"
          class="mt-2"
          @click:append-inner="show1 = !show1"
        ></v-text-field>
      </div>

      <v-btn class="me-4 mt-6 text-white font-500" type="submit" color="#88b343">
        {{ description.btn }}
      </v-btn>

      <v-btn @click="handleReset" class="mt-6"> Limpar </v-btn>
    </form>
  </div>
</template>
