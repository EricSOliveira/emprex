<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '../stores/auth'
import type { Alert } from '../stores/auth'

const { login, register, userIsLogged, authNotifications } = useAuthStore()

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
const alert = ref<Alert>({
  hide: true,
  title: '',
  text: '',
  type: undefined
})
const description = ref({
  title: '',
  span: '',
  btn: ''
})

onMounted(() => {
  userIsLogged()
  email.value.value = ''
  password.value.value = ''
})

const showAlert = (response: string) => {
  alert.value = authNotifications(response)

  window.setInterval(() => {
    alert.value.hide = true
  }, 3000)
}

const submit = handleSubmit(async (values) => {
  const response: any =
    step.value === 'signIn'
      ? await login(values.email, values.password)
      : await register(values.email, values.password)

  if (response !== undefined) showAlert(response)
})

watch(
  () => step.value,
  (newVal) => {
    if (newVal === 'signIn') {
      description.value.title = 'Entrar'
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
  <main class="relative flex flex-justify-center items-center h-full !w-full !max-w-[500px]">
    <v-alert
      border="start"
      border-color="error"
      dense
      prominent
      elevation="2"
      :type="alert.type"
      :title="alert.title"
      :text="alert.text"
      transition="fade-transition"
      v-if="!alert.hide"
      class="!absolute top-[20px] w-full"
    >
    </v-alert>

    <v-card class="!p-5 w-full">
      <h1 class="text-[2rem] font-[600] pl-[10px]">{{ description.title }}</h1>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          label="E-mail"
          class="mt-6"
        ></v-text-field>

        <div class="relative">
          <router-link
            to="/reset-password"
            class="absolute text-[12px] text-[#88b343] cursor-pointer top-0 right-0"
          >
            Esqueci minha senha
          </router-link>
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
          <br />
          <span
            @click="step = step === 'signIn' ? 'signUp' : 'signIn'"
            class="absolute text-[12px] text-[#88b343] cursor-pointer bottom-0 right-0"
          >
            {{ description.span }}
          </span>
        </div>

        <v-btn class="me-4 mt-6 text-white font-500" type="submit" color="#88b343">
          {{ description.btn }}
        </v-btn>

        <v-btn @click="handleReset" class="mt-6"> Limpar </v-btn>
      </form>
    </v-card>
  </main>
</template>
