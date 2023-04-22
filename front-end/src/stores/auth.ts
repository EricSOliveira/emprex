import { ref } from 'vue'
import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {

  const loggedUser = ref<any>()
  const token = ref<string>("")
  const router = useRouter()

  // const userIsLogged = () => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       loggedUser.value = user;
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }

  const updateToken = (newToken: string) => {
    token.value = newToken
  }

  const login = async (email: string, password: string) => {
    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential: any) => {
        loggedUser.value = userCredential.user;
        updateToken(loggedUser.value.auth.currentUser?.accessToken)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
      });

    return token
  }

  const register = async (email: string, password: string) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential: { user: any; }) => {
        loggedUser.value = userCredential.user;
        updateToken(loggedUser.value.auth.currentUser?.accessToken)
      })
      .catch((error: { code: any; message: any; }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
      });

    return token
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

  return { register, login, logout, loggedUser, token }
}, {
  persist: {
    paths: ['token', 'loggedUser'],
  },

})
