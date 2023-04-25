<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { formatCurrency } from '@/helpers/formatCurrency'
import { formatISODate } from '@/helpers/formatISODate'
import { useJsonApi } from '@/stores/jsonApi'
import type { Loan } from '@/stores/jsonApi'

interface Loans {
  loans: Loan[]
  page: number
  pageCount: number
}

const { getData } = useJsonApi()
const loansData = ref<Loans>({
  loans: [
    {
      autoDecline: '',
      contractNumber: '',
      createdAt: '',
      disbursedAmount: 0,
      disbursementDate: '',
      expiryDate: '',
      firstPaymentDate: '',
      id: '',
      numberOfInstallments: 0,
      status: '',
      totalAmount: 0,
      type: ''
    }
  ],
  page: 1,
  pageCount: 1
})
const loading = ref(false)

const dialog = ref(false)
const dialogDelete = ref(false)
const editedIndex = ref(-1)

const editedItem = ref<Loan>({
  autoDecline: '',
  contractNumber: '',
  createdAt: '',
  disbursedAmount: 0,
  disbursementDate: '',
  expiryDate: '',
  firstPaymentDate: '',
  id: '',
  numberOfInstallments: 0,
  status: '',
  totalAmount: 0,
  type: ''
})

const defaultItem = ref<Loan>({
  autoDecline: '',
  contractNumber: '',
  createdAt: '',
  disbursedAmount: 0,
  disbursementDate: '',
  expiryDate: '',
  firstPaymentDate: '',
  id: '',
  numberOfInstallments: 0,
  status: '',
  totalAmount: 0,
  type: ''
})

const search = ref('')
const sortBy = ref([{ key: 'contractNumber', order: 'asc' }])

const headers = ref([
  { key: 'id', title: 'ID', width: '100px' },
  { key: 'contractNumber', title: 'N° Contrato', width: '140px' },
  { key: 'createdAt', title: 'Dt. Criação', width: '100px' },
  { key: 'disbursedAmount', title: 'Desembolso', width: '140px' },
  { key: 'disbursementDate', title: 'Dt. Desembolso', width: '100px' },
  { key: 'expiryDate', title: 'Vencimento', width: '100px' },
  { key: 'firstPaymentDate', title: '1° Pgtm', width: '100px' },
  { key: 'numberOfInstallments', title: 'Num. Parcelas', width: '80px' },
  { key: 'status', title: 'Status', width: '100px' },
  { key: 'totalAmount', title: 'Total', width: '140px' },
  { key: 'type', title: 'Tipo', width: '90px' },
  { key: 'actions', title: 'Ações', width: '100px' }
])

const tableItems = computed(() => loansData.value.loans)
const itemsPerPage = ref(5)

watch(
  () => tableItems.value.length,
  (newCount) => {
    itemsPerPage.value = newCount
  },
  { immediate: true }
)

const populateData = async (page?: number, perPage?: number) => {
  loading.value = true

  const { data } = await getData(page, perPage)
  loansData.value = data

  loansData.value.loans.forEach((it: any) => {
    const dateKeys = ['createdAt', 'disbursementDate', 'expiryDate', 'firstPaymentDate']
    const amountKeys = ['disbursedAmount', 'totalAmount']
    Object.entries(it).forEach(([key, val]) => {
      if (dateKeys.includes(key)) it[key] = formatISODate(String(val))
      if (amountKeys.includes(key)) it[key] = formatCurrency(String(val))
    })
  })

  loading.value = false
}

function handleFilter(value: string, query: string, item?: any) {
  const filters = ['contractNumber', 'expiryDate', 'firstPaymentDate', 'disbursementDate']

  const filterVal = Object.entries(item.columns).map(([key, val]) => {
    if (filters.includes(key)) return val
  })

  return filterVal.toString().toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1
}

function editItem(item: Loan) {
  editedIndex.value = loansData.value.loans.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

function deleteItem(item: Loan) {
  editedIndex.value = tableItems.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function deleteItemConfirm() {
  tableItems.value.splice(editedIndex.value, 1)
  closeDelete()
}

function close() {
  dialog.value = false

  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1
}

function closeDelete() {
  dialogDelete.value = false

  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(tableItems.value[editedIndex.value], editedItem.value)
  } else {
    tableItems.value.push(editedItem.value)
  }
  close()
}

onMounted(async () => {
  await populateData()
})
</script>

<template>
  <div class="loans-container">
    <v-container v-show="loading">
      <v-row>
        <v-col cols="12" md="6">
          <v-skeleton-loader
            class="mx-auto border"
            width="1460px"
            height="586px"
            type="table"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-data-table
      v-show="!loading"
      :headers="headers"
      :items="tableItems"
      item-key="key"
      class="elevation-1"
      :search="search"
      :custom-filter="handleFilter"
      :sort-by="sortBy"
      multi-sort
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Pesquisa por n° contrato, dt. criação, 1° pgtm ou vencimento"
          class="pa-4"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="80vw">
          <v-card>
            <v-card-title>
              <span class="text-h5">Edição de Registro</span>
            </v-card-title>

            <v-card-text>
              <v-container fluid>
                <v-row>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.id"
                      :label="headers[0].title"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.contractNumber"
                      :label="headers[1].title"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.createdAt"
                      :label="headers[2].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.disbursedAmount"
                      :label="headers[3].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.expiryDate"
                      :label="headers[4].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.firstPaymentDate"
                      :label="headers[5].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.numberOfInstallments"
                      :label="headers[6].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.firstPaymentDate"
                      :label="headers[7].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.status"
                      :label="headers[8].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.totalAmount"
                      :label="headers[9].title"
                    ></v-text-field>
                  </v-col>
                  <v-col class="min-w-[14rem]">
                    <v-text-field
                      v-model="editedItem.type"
                      :label="headers[10].title"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"> Cancelar </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save"> Salvar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Tem certeza que deseja exluir esse item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template #item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)"> mdi-pencil </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>

      <template #bottom>
        <div class="text-center pt-2">
          <v-pagination
            v-model="loansData.page"
            :length="loansData.pageCount"
            @click="populateData(loansData.page)"
          ></v-pagination>
          <v-text-field
            :model-value="itemsPerPage"
            class="pa-2"
            label="Items por página"
            type="number"
            min="-1"
            max="15"
            @click="populateData(1, itemsPerPage)"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          ></v-text-field>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss">
.loans-container {
  width: 100%;
  max-width: 1460px;
  min-height: 80vh;

  table {
    table-layout: fixed;
  }
  .v-table .v-table__wrapper > table > tbody > tr > td,
  .v-table .v-table__wrapper > table > tbody > tr > th {
    left: 0 !important;
  }
  .v-progress-linear__determinate,
  .v-progress-linear__indeterminate {
    height: 10px;
  }
}
</style>
