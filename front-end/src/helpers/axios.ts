import type { AxiosInstance } from 'axios'
import axios from 'axios'

const clientInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config: any) => {
      const interceptedConfig = config
      const token = JSON.parse(localStorage.auth).token
      interceptedConfig.headers = {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      }
      return interceptedConfig
    },
    (error: any) => Promise.reject(error),
  )
}

export const createClient = (baseURL: any, auth = true) => {
  const api = axios.create({ baseURL })
  if (auth)
    clientInterceptors(api)
  return api
}
