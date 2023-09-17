<template>
  <div>
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-btn icon class="mr-2" @click="goBack">
                <v-icon>
                  mdi-arrow-left
                </v-icon>
              </v-btn>
              <div class="font-18 font-weight-bold">
                {{ $t('account.shipping_address') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="card-border pa-2">
            <div class="d-flex align-center">
              <div class="font-18 font-weight-bold pl-2">
                {{ $t('account.shipping_address') }}
              </div>
              <v-spacer />
              <v-btn color="primary" class="text-none font-16 font-weight-bold border-radius-10" @click="addAddress">
                {{ $t('account.add') }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <div>
            <v-row v-if="list_address.length > 0">
              <v-col v-for="(item, idx) in list_address" :key="idx" :cols="12" :xs="6" :md="6" lg="4">
                <v-card class="card-border px-4 py-2 fill-height" @click="viewDetailAddress(item.id)">
                  <v-icon v-if="item.is_default" color="#6EBE46" class="address-check">
                    mdi-checkbox-marked-circle
                  </v-icon>
                  <div class="list-content">
                    <div class="list-title primary--text font-18 font-weight-bold">
                      {{ item.name }}
                    </div>
                    <div class="list-subtitle font-14 text-two-line">
                      {{ item.address }}
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <div v-if="list_address.length < 1" class="address-notfound">
              {{ $t('account.save_address_info') }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { listAddress } from '@/api/customer'
export default {
  data() {
    return {
      list_address: []
    }
  },
  mounted() {
    this.getAddress()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'account_detail' }).catch(() => {})
    },
    addAddress() {
      this.$router.push({ name: 'add_address' }).catch(() => {})
    },
    viewDetailAddress(id) {
      this.$router.push({ name: 'detail_address', params: { id: id }}).catch(() => {})
    },
    async getAddress() {
      try {
        const params = {
          sort_column: ['is_default'],
          sort_type: ['desc']
        }
        const { data } = await listAddress(params)
        this.list_address = data.data
      } catch (e) {
        this.list_address = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    }
  }
}
</script>
