<template lang="html">
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
                {{ $t('product.payment_method') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <v-list class="list-payment">
            <template v-if="isCD[0]">
              <v-list-item
                :class="[{ 'selected_payment_method': selectedPayment[isCD[1]] ? selectedPayment[isCD[1]][0] === 0 ? true : false : false }]"
                :disabled="checkDisabledCOD(payment[isCD[1]].enabled)"
                @click="selectPayment(isCD[1], payment[isCD[1]], 0)"
              >
                <div class="d-flex align-center mr-2">
                  <div class="selected_payment" />
                </div>
                <v-list-item-avatar>
                  <v-img :src="payment[0].image" contain />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-14 font-weight-bold">
                    <span v-if="dataInCart.remark === 'DELIVERY'">
                      Bayar saat terima pesanan
                    </span>
                    <span v-else>
                      Bayar di toko
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-expansion-panels v-model="panel_payment" flat multiple :style="{ marginBottom: marginMenuBottom + 'px' }" class="__panel-payment-method">
              <template v-for="(item, idx) in payment">
                <v-expansion-panel
                  v-if="item.code !== 'CD' && item.code !== 'CC'"
                  :key="idx"
                  :disabled="item.enabled === 0 || item.detail.length === 0 ? true : false"
                >
                  <v-expansion-panel-header>
                    <template>
                      <v-row no-gutters>
                        <v-col cols="12">
                          <div class="d-flex">
                            <div class="d-block">
                              <div class="d-flex align-center">
                                <span class="d-flex __title-payment-method">
                                  {{ item.name }}
                                </span>
                              </div>
                              <!-- <div v-if="item.code === 'BT'" class="mt-1 subtitle-2 red--text">
                                Minimum Pembayaran <span v-mask-money="Number($store.state.selected_outlet.setting.minimum_payment_amount_va)" />
                              </div> -->
                            </div>
                            <v-spacer />
                            <div v-if="item.enabled === 0 || item.detail.length === 0" class="d-flex align-center">
                              <div class="tag-coming-soon">
                                coming soon
                              </div>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:actions>
                      <v-icon color="secondary">
                        $expand
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="content-panel-payment">
                    <v-list class="list-wallet-payment">
                      <template v-for="(child, index) in item.detail">
                        <v-list-item
                          :key="index + 'child'"
                          :class="[{ 'selected_payment_method': selectedPayment[idx] ? selectedPayment[idx][0] === index ? true : false : false }]"
                          :disabled="vaCheckEnable(child, item.code)"
                          @click="selectPayment(idx, child, index, item)"
                        >
                          <div class="d-flex align-center mr-2">
                            <div class="selected_payment" />
                          </div>
                          <v-list-item-avatar width="50" height="28">
                            <v-img :src="child.image" contain width="50" height="28" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="font-14 font-weight-bold">
                              {{ child.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle v-if="child.code === 'ShopeePay' && !$vuetify.breakpoint.smAndDown" class="font-10">
                              Hanya untuk mobile
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
            </v-expansion-panels>
          </v-list>
        </v-col>
      </v-row>
      <div ref="refMenuBottom" class="__menu-bottom menu-full">
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
          <v-btn color="primary" block x-large class="text-none" :disabled="disabled" @click="nextPay()">
            Lanjut
          </v-btn>
        </v-col>
      </div>
      <v-bottom-sheet v-model="sheet.phone" :content-class="'bottom-sheet-full width-full'">
        <v-sheet style="height: 100%">
          <div class="sheet-bar">
            <div class="sheet-bar-content">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <div class="d-flex align-center">
                      <v-btn icon class="mr-2" @click="closeSheetPhone">
                        <v-icon>
                          mdi-arrow-left
                        </v-icon>
                      </v-btn>
                      <div class="font-18 font-weight-bold">
                        Link Aja
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
          <v-container>
            <ValidationObserver ref="observerFrmPhone">
              <v-row>
                <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
                  <div class="card--input mt-2 pa-4">
                    <div class="d-flex align-center">
                      <div class="font-weight-bold font-18">
                        Total Pembayaran
                      </div>
                      <v-spacer />
                      <div class="font-weight-bold font-18">
                        <span v-mask-money="dataInCart.total" />
                      </div>
                    </div>
                  </div>
                  <div class="card--input mt-4 pa-4">
                    <div class="d-flex align-center pb-2">
                      <div class="sheet-item-icon">
                        <v-img :src="form.payment_detail.image" contain width="50" height="28" />
                      </div>
                      <div>
                        {{ form.payment_detail.name }}
                      </div>
                    </div>
                    <div class="mt-2 mb-1 font-12">
                      Masukkan nomor handphone {{ form.payment_detail.name }} Anda
                    </div>
                    <div>
                      <l-a-phone-number v-model="form.phone" type="solo" />
                    </div>
                    <div class="font-12 line-height-normal">
                      Kamu akan menuju ke aplikasi {{ form.payment_detail.name }} setelah menekan tombol lanjut
                    </div>
                  </div>
                </v-col>
              </v-row>
              <div class="__menu-bottom menu-full">
                <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
                  <v-btn color="primary" block x-large class="text-none" @click="pay">
                    {{ $t('component.next') }}
                  </v-btn>
                </v-col>
              </div>
            </ValidationObserver>
          </v-container>
        </v-sheet>
      </v-bottom-sheet>
    </v-container>
  </div>
</template>
<script>
import { listPayment } from '@/api/payment'
import { createOrder } from '@/api/order'
import LAPhoneNumber from '@/components/LAphone/index'
import {
  ValidationObserver
} from 'vee-validate'
export default {
  components: {
    ValidationObserver,
    LAPhoneNumber
  },
  data() {
    return {
      sheet: {
        phone: false
      },
      margin_menu_bottom: 0,
      disabled: true,
      payment: [],
      selectedPayment: [],
      panel_payment: [0, 1],
      dataInCart: {},
      order: {},
      form: {
        payment_mode_id: 0,
        bank_code: '',
        payment_mode_code: '',
        phone: '',
        redirect_url: '',
        shipping_address: '',
        shipping_cost: 0,
        payment_detail: {}
      }
    }
  },
  computed: {
    marginMenuBottom() {
      return this.margin_menu_bottom
    },
    isCD() {
      const index = this.payment.findIndex((e) => e.code === 'CD')
      if (index !== -1) {
        return [true, index]
      } else {
        return [false, null]
      }
    }
  },
  watch: {
    'form.payment_mode_id': function(newItem, oldItem) {
      if (newItem !== '') {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  mounted() {
    this.margin_menu_bottom = this.$refs.refMenuBottom.clientHeight
    this.getData()
    this.getPayment()
  },
  methods: {
    getData() {
      const LOCAL_DATA_CART = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
      if (LOCAL_DATA_CART) {
        this.dataInCart = JSON.parse(LOCAL_DATA_CART)
        for (let i = 0; i < this.dataInCart.item.length; i++) {
          if (this.dataInCart.item[i].checked === false) {
            this.$delete(this.dataInCart.item, i)
          }
        }
      }
    },
    goBack() {
      this.$router.push({ name: 'shopping_cart' }).catch(() => {})
    },
    async getPayment() {
      try {
        const { data } = await listPayment()
        this.payment = data.data
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    checkDisabledCOD(isCD) {
      const auth_data = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_auth_data'))
      if (this.$store.state.outlet.selected_outlet.setting.use_pay_on_the_spot === 1) {
        if (this.dataInCart.remark === 'DELIVERY') {
          if (auth_data.auth_by === 'GUEST') {
            return true
          } else {
            if (this.dataInCart.shipping_courier_id) {
              return true
            } else {
              return false
            }
          }
        } else {
          return false
        }
      } else {
        if (this.dataInCart.remark === 'DELIVERY') {
          return true
        } else {
          return false
        }
      }
    },
    vaCheckEnable(child, code) {
      if (child.code === 'BCA') {
        return true
      } else {
        if (child.enabled === 1) {
          if (code === 'BT') {
            if (this.$store.state.outlet.selected_outlet.setting.active_minimum_payment_amount_va) {
              if (this.dataInCart.total_amount < Number(this.$store.state.outlet.selected_outlet.setting.minimum_payment_amount_va)) {
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          } else {
            if (child.code === 'ShopeePay' && !this.$vuetify.breakpoint.smAndDown) {
              return true
            } else {
              return false
            }
          }
        } else {
          return true
        }
      }
    },
    selectPayment(idx, pay_item, index, parent_item = null) {
      this.selectedPayment = []
      this.$set(this.selectedPayment, idx, [index])
      this.form.payment_mode_id = pay_item.payment_id

      if (parent_item !== null) {
        if (parent_item.code !== null) {
          this.form.payment_mode_code = parent_item.code
        } else {
          this.form.payment_mode_code = pay_item.code
        }
      } else {
        this.form.payment_mode_code = pay_item.code
      }

      if (this.form.payment_mode_code === 'BT') {
        this.form.bank_code = pay_item.code
      } else {
        delete this.form.bank_code
      }
      this.form.payment_detail = pay_item
    },
    nextPay() {
      if (JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))) {
        this.$store.dispatch('remove_order')
      }
      if (this.form.payment_mode_code === 'OVO' || this.form.payment_mode_code === 'LINKAJA') {
        this.sheet.phone = true
      } else if (this.form.payment_mode_code === 'CC') {
        // this.dialogCC = true
      } else {
        this.pay()
      }
    },
    async pay() {
      this.disabled = true
      let isValid = true
      if (this.sheet.phone === true) {
        isValid = await this.$refs.observerFrmPhone.validate()
        if (isValid) {
          this.sheet.phone = false
        }
      }

      if (isValid) {
        var baseDomain = window.location.href
        if (this.form.payment_mode_code === 'CD' || this.form.payment_mode_code === 'BT') {
          delete this.form.phone
          delete this.form.redirect_url
        } else if (this.form.payment_mode_code === 'LINKAJA' || this.form.payment_mode_code === 'ShopeePay') {
          this.form.redirect_url = baseDomain + '/check'
        } else if (this.form.payment_mode_code === 'OVO') {
          delete this.form.redirect_url
        } else if (this.form.payment_mode_code === 'DANA') {
          delete this.form.phone
          this.form.redirect_url = baseDomain + '/check'
        }

        delete this.form.payment_mode_code
        delete this.form.shipping_address
        delete this.form.shipping_cost
        this.$set(this.dataInCart, 'payment', this.form)

        try {
          const { data } = await createOrder(this.dataInCart)
          this.$store.dispatch('saveDataOrder', data.data)
          if (data.data.payment_mode_id === 10) {
            if (data.data.status === 'X') {
              this.$router.push({ name: 'order_failed' }).catch(() => {})
            } else {
              this.$router.push({ name: 'order_success' }).catch(() => {})
            }
          } else {
            if (data.data.payment_log) {
              if (data.data.payment_log.payment_source === 'VIRTUAL-ACCOUNT') {
                this.$router.push({ name: 'va_order' }).catch(() => {})
              } else {
                if (data.data.payment_log.checkout_url) {
                  window.location = data.data.payment_log.checkout_url
                } else {
                  if (data.data.payment_log.global_status === 'P') {
                    this.$router.push({ name: 'order_payment_pending' }).catch(() => {})
                  } else if (data.data.payment_log.global_status === 'X') {
                    this.$router.push({ name: 'order_payment_failed' }).catch(() => {})
                  } else if (data.data.payment_log.global_status === 'Z') {
                    this.$router.push({ name: 'order_success' }).catch(() => {})
                  }
                }
              }
            } else {
              if (data.data.status === 'Z') {
                this.$router.push({ name: 'order_success' }).catch(() => {})
              } else if (data.data.status === 'X') {
                this.$router.push({ name: 'order_failed' }).catch(() => {})
              }
            }
          }
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
      // try {
      //   var result = await createDataOrder(this.dataInCart)
      //   this.$store.state.loading_axios = false
      //   const { data } = result
      //   this.$store.dispatch('create_order', data.data)
      //   if (data.data.payment_mode_id === 10) {
      //     if (data.data.status === 'X') {
      //       this.$router.push({ name: 'order_failed' }).catch(() => {})
      //     } else {
      //       this.$router.push({ name: 'order_success' }).catch(() => {})
      //     }
      //   } else {
      //     if (data.data.payment_log) {
      //       if (data.data.payment_log.payment_source === 'VIRTUAL-ACCOUNT') {
      //         this.$router.push({ name: 'va_order' }).catch(() => {})
      //       } else {
      //         if (data.data.payment_log.checkout_url) {
      //           window.location = data.data.payment_log.checkout_url
      //         } else {
      //           if (data.data.payment_log.global_status === 'P') {
      //             this.$router.push({ name: 'order_payment_pending' }).catch(() => {})
      //           } else if (data.data.payment_log.global_status === 'X') {
      //             this.$router.push({ name: 'order_payment_failed' }).catch(() => {})
      //           } else if (data.data.payment_log.global_status === 'Z') {
      //             this.$router.push({ name: 'order_success' }).catch(() => {})
      //           }
      //         }
      //       }
      //     } else {
      //       if (data.data.status === 'Z') {
      //         this.$router.push({ name: 'order_success' }).catch(() => {})
      //       } else if (data.data.status === 'X') {
      //         this.$router.push({ name: 'order_failed' }).catch(() => {})
      //       }
      //     }
      //   }
      //   this.resetForm()
      // } catch (e) {
      //   if (e.statusCode === 401) {
      //     this.$store.dispatch('fetchToken')
      //     this.$router.push({ name: 'login', query: { redirect: this.$route.name }}).catch(() => {})
      //   } else if (e.statusCode === 501) {
      //     if (!this.$isEmpty(this.dataInCart)) {
      //       if (this.$store.state.selected_type === 'DELIVERY') {
      //         this.dialogChangeShippingTime = true
      //         this.loadShippingTime()
      //       }
      //       this.$store.state.show_error = true
      //       this.$store.state.error_message = e.string
      //       this.$store.state.error_type = e.statusCode
      //     } else {
      //       this.$store.state.show_error = true
      //       this.$store.state.error_message = e.string
      //       this.$store.state.error_type = e.statusCode
      //     }
      //   } else {
      //     this.$store.state.show_error = true
      //     this.$store.state.error_message = e.string
      //     this.$store.state.error_type = e.statusCode
      //   }
      // }
      // this.disabled = false
    },
    closeSheetPhone() {
      this.sheet.phone = false
      this.$refs.observerFrmPhone.reset()
      this.form.phone = ''
    }
  }
}
</script>
