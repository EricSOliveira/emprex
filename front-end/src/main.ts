import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import firebase from 'firebase/compat/app';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { Router } from 'vue-router'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import "vuetify/styles"
import { createVuetify } from "vuetify";
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import * as labs from 'vuetify/labs/components'
import { VDataTable } from 'vuetify/labs/VDataTable'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labs,
    VDataTable,
  },
  directives,
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

const pinia = createPinia()

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}

pinia.use(piniaPluginPersistedstate)
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
