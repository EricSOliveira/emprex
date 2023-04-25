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
  <main class="relative flex justify-center items-center h-full !w-full">
    <div class="img-title w-[150px] h-[60px] cursor-pointer" @click="router.push('/login')" />

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
      <v-card-title class="text-h5 !pt-7 !px-7">Trocar senha, informe o e-mail</v-card-title>
      <v-card-actions>
        <form @submit.prevent="submit" class="!pb-3 !px-7">
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="E-mail"
            class="mt-6 flex justify-center"
          ></v-text-field>
          <div class="text-right">
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

<style lang="scss" scoped>
form {
  width: 100% !important;
  padding: 0 10px;
}

.img-title {
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('data:image/png;base64,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');
}
</style>
