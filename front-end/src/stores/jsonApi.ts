import { defineStore } from 'pinia'
import { createClient } from '../helpers/axios'

const jsonApiUrl = import.meta.env.VITE_JSON_API

export interface Loan {
  autoDecline: any
  contractNumber: string
  createdAt: string
  disbursedAmount: number
  disbursementDate: string
  expiryDate: string
  firstPaymentDate: string
  id: string
  numberOfInstallments: number
  status: string
  totalAmount: number
  type: string
}

export const useJsonApi = defineStore('jsonApi', () => {
  const publicJsonApi: any = createClient(jsonApiUrl, false)
  // const jsonApi = createClient(jsonApiUrl)

  const getData = (page?: number, per_page?: number) => {
    return publicJsonApi.get(`/loans`, {
      params: { page, per_page },
    })
  }

  return { getData }
})
