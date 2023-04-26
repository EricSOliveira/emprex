<script lang="ts" setup>
import type { Loan } from '@/stores/jsonApi'

interface Props {
  headers: any[]
  item: Loan
  index: number
  showDialog: boolean
}

const prop = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close', showDialog: boolean): void
  (e: 'update', updateLoan: { index: number; item: Loan }): void
  (e: 'save'): void
}>()

const dialog = computed(() => prop.showDialog)
const editedIndex = computed(() => prop.index)

const editedItem = computed(() => prop.item)

// function editItem(item: Loan) {
//   editedIndex.value = loansData.value.loans.indexOf(item)
//   editedItem.value = Object.assign({}, item)
//   dialog.value = true
// }

function close() {
  emit('close', false)
}

function save() {
  const updateLoan = { index: editedIndex.value, item: editedItem.value }
  emit('update', updateLoan)
  emit('save')
}
</script>

<template>
  <div class="edit-loan-container">
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
                <v-text-field v-model="editedItem.status" :label="headers[8].title"></v-text-field>
              </v-col>
              <v-col class="min-w-[14rem]">
                <v-text-field
                  v-model="editedItem.totalAmount"
                  :label="headers[9].title"
                ></v-text-field>
              </v-col>
              <v-col class="min-w-[14rem]">
                <v-text-field v-model="editedItem.type" :label="headers[10].title"></v-text-field>
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
  </div>
</template>

<style lang="scss">
.edit-loan-container {
}
</style>
