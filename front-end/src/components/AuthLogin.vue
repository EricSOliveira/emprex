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
const loading = ref(false)
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
  loading.value = true

  const response: any =
    step.value === 'signIn'
      ? await login(values.email, values.password)
      : await register(values.email, values.password)

  loading.value = false

  if (step.value !== 'signIn') step.value = 'signIn'

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

    <v-card class="w-full login-form effect">
      <div class="form-effect p-5">
        <div class="flex justify-between w-full">
          <h1 class="text-[2rem] font-[600] pl-[10px]">{{ description.title }}</h1>
          <div class="img-title w-[150px] h-[60px]" />
        </div>
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

          <v-btn
            class="me-4 mt-6 text-white font-500"
            type="submit"
            color="#88b343"
            :loading="loading"
          >
            {{ description.btn }}
          </v-btn>

          <v-btn @click="handleReset" class="mt-6"> Limpar </v-btn>
        </form>
      </div>
    </v-card>
  </main>
</template>

<style lang="scss" scoped>
.form-effect {
  position: relative;
  inset: 2px;
  background: #fff;
  z-index: 2;
}

.img-title {
  background-image: url('data:image/png;base64,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');
}

a:hover {
  background-color: transparent;
}

.effect {
  position: relative;
  overflow: hidden;
  padding: 4px 8px 8px 5px;
}
.effect::before {
  content: '';
  z-index: 1;
  position: absolute;
  top: -50%;
  left: -50%;
  width: 100%;
  height: 100%;
  transform-origin: bottom right;
  background: linear-gradient(0deg, transparent, #88b343, #88b343);
  animation: animate 6s linear infinite;
}
.effect::after {
  content: '';
  z-index: 1;
  position: absolute;
  top: -50%;
  left: -50%;
  width: 100%;
  height: 100%;
  transform-origin: bottom right;
  background: linear-gradient(0deg, transparent, #88b343, #88b343);
  animation: animate 6s linear infinite;
  animation-delay: -3s;
}
@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
