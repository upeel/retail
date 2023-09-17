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
                {{ $t('profile.my_order') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="filter-home mt-1">
            <div class="input-with-label">
              <v-text-field v-model="temp.q" hide-details prepend-inner-icon="mdi-magnify" readonly :placeholder="$t('component.search_order')" solo height="56" class="shadow-input" @click="sheet.search = true" />
            </div>
            <div class="wrap-filter">
              <div class="col-filter">
                <div class="filter-action noselect" @click="dialog.status = true">
                  <div>
                    Status
                  </div>
                </div>
              </div>
              <div class="verticall-line" />
              <div class="col-filter">
                <div class="filter-action noselect" @click="openDialogOrderDate">
                  <div>
                    {{ $t('component.buy_date') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="paramsText" class="tagging-params">
            <div class="tagging-params-text">
              {{ paramsText }}
            </div>
            <v-spacer />
            <v-btn icon width="40" height="40" @click="removeParams">
              <v-icon size="16">
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col v-scroll="onScroll" cols="12">
          <div>
            <v-row>
              <v-col v-for="(item, idx) in orders" :key="idx" :cols="12" :xs="6" :md="6" lg="4">
                <v-card class="order-thumbnail" @click="showDetail(item)">
                  <div class="order-head">
                    <div class="order-content">
                      <div class="order-title">
                        {{ item.forder_date }}, {{ item.forder_time }}
                      </div>
                      <div class="order-subtitle">
                        {{ item.order_no }}
                      </div>
                    </div>
                    <div :class="[`order-status`, { 'waiting': item.status_inquiry === 1 || item.status_inquiry === 2 }, { 'preparing': item.status_inquiry === 3 || item.status_inquiry === 4 }, { 'sent': item.status_inquiry === 5 }, { 'completed': item.status_inquiry === 6 }]">
                      <div class="mr-1">
                        <v-icon v-if="item.status_inquiry === 1 || item.status_inquiry === 2" :size="18">
                          mdi-information-variant
                        </v-icon>
                        <v-icon v-else-if="item.status_inquiry === 3 || item.status_inquiry === 4" :size="18">
                          mdi-reload
                        </v-icon>
                        <v-icon v-else-if="item.status_inquiry === 5" :size="18" color="white">
                          mdi-truck
                        </v-icon>
                        <v-icon v-else-if="item.status_inquiry === 6" :size="18">
                          mdi-check-bold
                        </v-icon>
                      </div>
                      <div class="order-text-status">
                        {{ item.status_desc }}
                      </div>
                    </div>
                  </div>
                  <div class="order-item custom-scroll-bar">
                    <div v-for="(product, index) in item.items" :key="index" class="order-item-detail">
                      <div v-if="product.product_combo_id">
                        <v-img :src="product.product_combo_photo_md" height="40" width="40" />
                      </div>
                      <div v-else>
                        <v-img :src="product.product_photo_md" height="40" width="40" />
                      </div>
                      <div class="order-qty-item">
                        {{ product.qty }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog.status" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <div class="d-flex align-center justify-center py-3 px-4">
          <div class="font-18 font-weight-bold">
            Status
          </div>
          <v-btn icon class="btn-close-dialog" @click="dialog.status = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-list class="list-filter-category pb-0">
            <v-list-item @click="removeStatus()">
              <v-list-item-title>
                {{ $t('layout.all') }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="list-border-category" />
            <template v-for="(item, idx) in list_status">
              <v-list-item :key="idx + ' single'" @click="selectStatus(item)">
                <v-list-item-title>
                  {{ $t('order.status.' + item.name) }}
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="idx !== list_status.length - 1" :key="idx + ' border'" class="list-border-category" />
            </template>
          </v-list>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog ref="dialog_order_date" v-model="dialog.order_date" :return-value.sync="temp.order_date" persistent width="290px">
      <v-date-picker v-model="temp.order_date" scrollable :max="max_date">
        <v-spacer />
        <v-btn text color="primary" class="text-none" @click="closeDialogOrderDate()">
          Cancel
        </v-btn>
        <v-btn text color="primary" class="text-none" @click="selectDate()">
          Ok
        </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-bottom-sheet v-model="sheet.search" persistent :content-class="'sheet-full'">
      <v-sheet style="height: 100%">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
              <div class="pa-1">
                <v-form @submit.prevent="setParamsSearch">
                  <div class="input-with-label">
                    <v-autocomplete
                      ref="refsearch"
                      v-model="field_search"
                      :items="temp_order"
                      :loading="isLoading"
                      :search-input.sync="search"
                      hide-selected
                      hide-details
                      prepend-inner-icon="mdi-arrow-left"
                      :placeholder="$t('component.search_order')"
                      :menu-props="{ closeOnContentClick: true }"
                      solo
                      height="56"
                      hide-no-data
                      item-value="id"
                      item-text="order_no"
                      class="shadow-input"
                      @click:prepend-inner="closeSheetSearch"
                    >
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect" />
                      </template>
                      <template v-slot:append>
                        <v-btn type="submit" small width="28" height="28" min-width="28" class="px-0">
                          <v-icon size="16">
                            mdi-subdirectory-arrow-left
                          </v-icon>
                        </v-btn>
                      </template>
                      type="submit"
                    </v-autocomplete>
                  </div>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
import { debounce } from 'debounce'
import { orders } from '@/api/order'
export default {
  data() {
    return {
      sheet: {
        search: false
      },
      dialog: {
        status: false,
        order_date: false
      },
      params_search: {
        page: 1,
        per_page: 20
      },
      params: {
        search_column: [],
        search_operator: [],
        search_text: [],
        sort_column: ['order_date', 'order_time'],
        sort_type: ['desc', 'desc'],
        show_orderitems: 1,
        page: 1,
        per_page: 20
      },
      settingScroll: false,
      max_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      orders: [],
      list_status: [
        { id: 1, name: 'finished', status: 'Z' },
        { id: 2, name: 'sent', status: 'S' },
        { id: 3, name: 'waiting', status: 'P' },
        { id: 4, name: 'cancelled', status: 'X' }
      ],
      temp: {
        q: null,
        status: null,
        order_date: null
      },
      temp_order: [],
      isLoading: false,
      field_search: null,
      search: null
    }
  },
  computed: {
    paramsText() {
      const arrText = []
      if (!this.$isEmpty(this.$route.query)) {
        if (typeof this.$route.query.q !== 'undefined' && this.$route.query.q) {
          arrText.push(this.$route.query.q)
        }
        if (typeof this.$route.query.status !== 'undefined' && this.$route.query.status) {
          if (this.$route.query.status === 'Z') {
            arrText.push(this.$t('order.status.finished'))
          } else if (this.$route.query.status === 'S') {
            arrText.push(this.$t('order.status.sent'))
          } else if (this.$route.query.status === 'P') {
            arrText.push(this.$t('order.status.waiting'))
          } else if (this.$route.query.status === 'X') {
            arrText.push(this.$t('order.status.cancelled'))
          }
        }
        if (typeof this.$route.query.order_date !== 'undefined' && this.$route.query.order_date) {
          arrText.push(this.$route.query.order_date)
        }
      }
      return arrText.join(', ')
    },
    dataParams() {
      var params = {
        page: this.params.page,
        per_page: this.params.per_page,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type,
        show_orderitems: this.params.show_orderitems
      }
      if (this.params.search_column.length > 0) {
        params.search_column = this.params.search_column
        params.search_operator = this.params.search_operator
        params.search_text = this.params.search_text
      }
      return params
    }
  },
  watch: {
    search: debounce(async function(val) {
      this.params_search.page = 1
      if (val && val !== '') {
        const params = {
          search_text: val
        }
        this.getListSearch(params)
      } else {
        this.temp_order = []
      }
    }, 500),
    async '$route'(newItem) {
      let search_column = [...this.params.search_column]
      let search_operator = [...this.params.search_operator]
      let search_text = [...this.params.search_text]
      if (this.$isEmpty(newItem.query)) {
        search_column = []
        search_operator = []
        search_text = []
      } else {
        if (typeof newItem.query.q !== 'undefined') {
          const index = this.params.search_column.findIndex(function(data) {
            return data === 'order_no'
          })
          if (newItem.query.q) {
            if (index === -1) {
              search_column.push('order_no')
              search_operator.push('like')
              search_text.push(newItem.query.q)
            } else {
              search_column[index] = 'order_no'
              search_operator[index] = 'like'
              search_text[index] = newItem.query.q
            }
          } else {
            if (index !== -1) {
              search_column.splice(index, 1)
              search_operator.splice(index, 1)
              search_text.splice(index, 1)
            }
          }
        }
        if (typeof newItem.query.status !== 'undefined') {
          const list_status = [...this.list_status]
          let x = -1
          for (let i = 0; i < list_status.length; i++) {
            const index = search_text.findIndex(function(data) {
              return data === list_status[i].status
            })
            if (index !== -1) {
              x = index
              break
            }
          }
          if (newItem.query.status) {
            if (x === -1) {
              search_column.push('status')
              search_operator.push('=')
              search_text.push(newItem.query.status)
            } else {
              search_column[x] = 'status'
              search_operator[x] = '='
              search_text[x] = newItem.query.status
            }
          } else {
            if (x !== -1) {
              search_column.splice(x, 1)
              search_operator.splice(x, 1)
              search_text.splice(x, 1)
            }
          }
        }
        if (typeof newItem.query.order_date !== 'undefined') {
          const index = search_column.findIndex(function(data) {
            return data === 'order_date'
          })
          if (newItem.query.order_date) {
            if (index === -1) {
              search_column.push('order_date')
              search_operator.push('=')
              search_text.push(newItem.query.order_date)
            } else {
              search_column[index] = 'order_date'
              search_operator[index] = '='
              search_text[index] = newItem.query.order_date
            }
          } else {
            if (index !== -1) {
              search_column.splice(index, 1)
              search_operator.splice(index, 1)
              search_text.splice(index, 1)
            }
          }
        }
      }
      this.params.page = 1
      this.params.search_column = [...search_column]
      this.params.search_operator = [...search_operator]
      this.params.search_text = [...search_text]
      this.orders = []
      this.getOrders()
    }
  },
  mounted() {
    if (!this.$isEmpty(this.$route.query)) {
      if (typeof this.$route.query.q !== 'undefined' && this.$route.query.q) {
        this.temp.q = this.$route.query.q
        this.params.search_column.push('order_no')
        this.params.search_operator.push('like')
        this.params.search_text.push(this.$route.query.q)
      }
      if (typeof this.$route.query.status !== 'undefined' && this.$route.query.status) {
        this.temp.status = this.$route.query.status
        this.params.search_column.push('status')
        this.params.search_operator.push('=')
        this.params.search_text.push(this.$route.query.status)
      }
      if (typeof this.$route.query.order_date !== 'undefined' && this.$route.query.order_date) {
        this.temp.order_date = this.$route.query.order_date
        this.params.search_column.push('order_date')
        this.params.search_operator.push('=')
        this.params.search_text.push(this.$route.query.order_date)
      }
    }
    this.getOrders()
  },
  methods: {
    onScroll: debounce(async function(val) {
      if (this.settingScroll === false) {
        if ((window.innerHeight + window.scrollY + 150) >= document.body.offsetHeight) {
          this.getOrders()
        }
      }
    }, 500),
    goBack() {
      this.$router.push({ name: 'account_detail' }).catch(() => {})
    },
    async getOrders() {
      try {
        const { data } = await orders(this.dataParams)
        this.settingScroll = (data.data.length < this.params.per_page)
        data.data.map(item => {
          this.orders.push(item)
        })
        this.params.page++
      } catch (e) {
        this.settingScroll = true
        this.orders = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    removeStatus() {
      this.temp.status = null
      this.$router.push({
        name: 'orders',
        query: this.temp
      }).catch(() => {})
      this.dialog.status = false
    },
    openDialogOrderDate() {
      if (!this.$isEmpty(this.$route.query) && typeof this.$route.query.order_date !== 'undefined' && this.$route.query.order_date) {
        this.temp.order_date = this.$route.query.order_date
      } else {
        this.temp.order_date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      }
      this.dialog.order_date = true
    },
    closeDialogOrderDate() {
      if (!this.$isEmpty(this.$route.query) && typeof this.$route.query.order_date !== 'undefined' && this.$route.query.order_date) {
        this.temp.order_date = this.$route.query.order_date
      } else {
        this.temp.order_date = null
      }
      this.dialog.order_date = false
    },
    selectStatus(item) {
      this.temp.status = item.status
      this.$router.push({
        name: 'orders',
        query: this.temp
      }).catch(() => {})
      this.dialog.status = false
    },
    selectDate() {
      this.$refs.dialog_order_date.save(this.temp.order_date)
      this.$router.push({
        name: 'orders',
        query: this.temp
      }).catch(() => {})
      this.dialog.order_date = false
    },
    setParamsSearch: debounce(async function() {
      this.$refs.refsearch.isMenuActive = false
      this.temp.q = this.search
      this.$router.push({
        name: 'orders',
        query: this.temp
      }).catch(() => {})
      this.sheet.search = false
    }, 500),
    removeParams() {
      this.temp.q = null
      this.temp.status = null
      this.temp.order_date = null
      this.$router.push({
        name: 'orders'
      }).catch(() => {})
    },
    async getListSearch(params) {
      if (!this.$isEmpty(params) && typeof params.search_text !== 'undefined' && params.search_text) {
        try {
          params.page = this.params_search.page
          params.per_page = this.params_search.per_page
          params.search_column = 'order_no'
          params.search_operator = 'like'
          const { data } = await orders(params)
          data.data.map(item => {
            this.temp_order.push(item)
          })
          this.params_search.page++
        } catch (e) {
          this.temp_order = []
        }
      }
    },
    endIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) {
        const params = {
          search_text: this.search
        }
        this.getListSearch(params)
      }
    },
    closeSheetSearch() {
      this.sheet.search = false
      this.params_search.page = 1
    },
    showDetail(item) {
      this.$router.push({ name: 'order', params: { id: item.id }}).catch(() => {})
    }
  }
}
</script>
