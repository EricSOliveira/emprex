<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '../stores/auth'
import type { Alert } from '../stores/auth'

const router = useRouter()

const { sendRecoverPassword, authNotifications } = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: {
    email(value: string) {
      const regex = /([a-z0-9_\\.-]+)@([\da-z\\.-]+)\.([a-z\\.]{2,6})$/
      if (regex.test(value)) return true

      return 'Email inválido.'
    }
  }
})

const email = useField('email')

const alert = ref<Alert>({
  hide: true,
  title: '',
  text: '',
  type: undefined
})

const showAlert = (response: string) => {
  alert.value = authNotifications(response)

  if (alert.value.type === 'success') email.value.value = ''

  window.setInterval(() => {
    alert.value.hide = true
  }, 3000)
}

const submit = handleSubmit(async ({ email }) => {
  const response = await sendRecoverPassword(String(email))
  showAlert(response)
})
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

    <v-card>
      <v-card-title class="text-h5">Trocar senha, informe o e-mail</v-card-title>
      <v-card-actions>
        <form @submit.prevent="submit">
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="E-mail"
            class="mt-6 flex justify-center"
          ></v-text-field>
          <div class="pb-5 text-right">
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="router.push('/login')"
              >Voltar</v-btn
            >
            <v-btn color="#88b343" variant="text" type="submit">Enviar</v-btn>
            <v-spacer></v-spacer>
          </div>
        </form>
      </v-card-actions>
    </v-card>
  </main>
</template>

<style lang="scss" scope>
form {
  width: 100% !important;
  padding: 0 10px;
}
</style>
