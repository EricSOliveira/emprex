import { ref } from 'vue'
import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";
import { useRouter } from 'vue-router'


export interface Alert {
  title: string
  text: string
  hide: boolean
  type: "error" | "success" | "warning" | "info" | undefined
}

export const useAuthStore = defineStore('auth', () => {

  const loggedUser = ref<any>()
  const token = ref<string>("")
  const router = useRouter()

  const userIsLogged = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        loggedUser.value = user;
        authenticate()
      } else {
        logout()
      }
    });
  }

  const updateToken = (newToken: string) => {
    token.value = newToken
  }

  const login = async (email: string, password: string) => {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (userCredential: any) => {
        const isVerified = userCredential.user.emailVerified
        if (isVerified) {
          loggedUser.value = userCredential.user
          token.value = loggedUser.value.auth.currentUser?.accessToken
          userIsLogged()
        } else {
          return 'auth/email-login-needs-to-be-verified'
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
        return errorMessage;
      });
  }

  const register = async (email: string, password: string) => {
    return await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential: { user: any; }) => {
        userCredential.user.sendEmailVerification()
        return 'auth/email-needs-to-be-verified'
        // loggedUser.value = userCredential.user;
        // token.value = loggedUser.value.auth.currentUser?.accessToken
        // userIsLogged()
      })
      .catch((error: { code: any; message: any; }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
        return errorMessage;
      });
  }

  const logout = async () => {
    try {
      await firebase.auth().signOut();
      loggedUser.value = {}
      token.value = ""
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  const authenticate = () => {
    const unauthenticated = ['', null, undefined]
    const token = JSON.parse(localStorage.auth).token
    const updateToken = computed(() => unauthenticated.includes(token))

    if (!updateToken.value) router.push('/loans')
  }

  const sendRecoverPassword = async (userEmail: string) => {
    return await firebase.auth().sendPasswordResetEmail(userEmail)
      .then(() => {
        return 'auth/recover-password'
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
        return errorMessage
      });
  }

  const authNotifications = (response: string) => {
    const alert: Alert = {
      title: '',
      text: '',
      hide: false,
      type: undefined
    }

    if (response.includes('auth/user-not-found')) {
      alert.title = 'Opss'
      alert.text = 'E-mail inválido'
      alert.hide = false
      alert.type = 'error'
    }

    if (response.includes('auth/wrong-password).')) {
      alert.title = 'Opss'
      alert.text = 'Senha incorreta'
      alert.hide = false
      alert.type = 'error'
    }

    if (response.includes('auth/email-already-in-use')) {
      alert.title = 'Opss'
      alert.text = 'Usuário já cadastrado, faça login'
      alert.hide = false
      alert.type = 'error'
    }

    if (response.includes('auth/recover-password')) {
      alert.title = 'Obaa'
      alert.text = 'Recuperação de senha enviada, verifique seu e-mail'
      alert.hide = false
      alert.type = 'success'
    }

    if (response.includes('auth/email-needs-to-be-verified')) {
      alert.title = 'Obaa'
      alert.text = 'Verificação de e-mail enviada, acesse seu e-mail'
      alert.hide = false
      alert.type = 'success'
    }

    if (response.includes('auth/email-login-needs-to-be-verified')) {
      alert.title = 'Opss'
      alert.text = 'Verificação de e-mail pendente, acesse seu e-mail'
      alert.hide = false
      alert.type = 'error'
    }

    return alert
  }


  return { register, login, logout, userIsLogged, authenticate, sendRecoverPassword, authNotifications, loggedUser, token }
}, {
  persist: {
    paths: ['token', 'loggedUser'],
  },

})
