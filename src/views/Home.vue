<template>
  <div>
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div v-if="!$isEmpty($store.state.outlet.selected_outlet)" class="mr-2">
                <div class="d-flex align-center">
                  <div class="d-flex mr-2">
                    <img v-if="!$isEmpty($store.state.outlet.selected_outlet)" :src="$store.state.outlet.selected_outlet.logo" height="40" :alt="$store.state.outlet.selected_outlet.name" class="nav-logo">
                  </div>
                  <div>
                    <div class="d-flex align-center">
                      <div class="font-18 font-weight-bold nav-title-store cursor-pointer" @click="openDialogOutlet">
                        {{ $store.state.outlet.selected_outlet.name }}
                        <v-icon>
                          mdi-menu-down
                        </v-icon>
                      </div>
                    </div>
                    <div class="font-12" v-html="statusStore" />
                  </div>
                </div>
              </div>
              <v-spacer />
              <div class="flex-width-auto">
                <div class="nav-account pa-2" @click="$router.push({ name: 'account_detail' }).catch(() => {})">
                  <div class="d-flex align-center">
                    <div class="font-16 font-weight-bold mr-3">
                      {{ $isEmpty(customer) ? $t('layout.my_account') : customer.name }}
                    </div>
                    <div>
                      <v-img v-if="$isEmpty(customer)" :src="require('@/assets/img/png/Iconawesome-user-circle.png')" height="20" width="20" contain class="border-rounded" />
                      <v-img v-else :src="customer.photo_md" height="20" width="20" contain class="border-rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <free-shipping v-if="!$isEmpty($store.state.outlet.selected_outlet) && $store.state.outlet.selected_outlet.delivery.turn_off_private_courier !== 1" />
    <new-order v-if="new_order === true" />
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="filter-home mt-1">
            <div class="input-with-label">
              <v-text-field v-model="temp.q" hide-details prepend-inner-icon="mdi-magnify" readonly :placeholder="$t('component.search_product')" solo height="56" class="shadow-input" @click="sheet.search = true" />
            </div>
            <div class="wrap-filter">
              <div class="col-filter">
                <div class="filter-action noselect" @click="openDialogCategory">
                  <div>
                    {{ $t('component.category') }}
                  </div>
                </div>
              </div>
              <div class="col-filter verticall-line">
                <div class="filter-action noselect" @click="dialog.special_type = true">
                  <div>
                    {{ $t('component.special') }}
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
          <div v-if="search_not_found" class="py-4 text-center mt-10">
            <img :src="require('@/assets/img/svg/product_notfound.svg')" class="mb-4">
            <div class="product-notfound">
              Oops produk tidak ditemukan
            </div>
          </div>
        </v-col>
        <v-col v-scroll="onScrollProduct" cols="12">
          <list-product v-for="(item, idx) in dataProduct" :key="idx" :products="item.items" :title="item.product_group_name" :func-show="showDetail" />
        </v-col>
      </v-row>
    </v-container>
    <dialog-list-outlet v-model="dialog.outlet" />
    <v-dialog v-model="dialog.category" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <div class="d-flex align-center justify-center py-3 px-4">
          <div class="font-18 font-weight-bold">
            {{ $t('component.category') }}
          </div>
          <v-btn icon class="btn-close-dialog" @click="closeDialogCategory">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <div id="section-group" class="custom-scroll-bar" style="max-height: 460px; overflow: auto;">
          <v-list v-scroll:#section-group="onScrollGroup" class="list-filter-category">
            <v-list-item-group v-model="selectedCategory">
              <template v-for="(item, idx) in product_group">
                <v-list-group v-if="item.children.length > 0" :key="idx + ' child'" :value="false">
                  <template v-slot:activator>
                    <v-list-item class="pa-0">
                      <v-list-item-content class="pa-unset">
                        <v-list-item-title>
                          {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.children[0].name }} (+{{ item.children.length - 1 }} {{ $t('home.others') }})
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <v-list-item v-for="(child, i) in item.children" :key="i + ' list-child'" @click="selectGroup(child)">
                    <v-list-item-title>
                      {{ child.name }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>
                <v-list-item v-else :key="idx + ' single'" @click="selectGroup(item)">
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item>
                <v-divider v-if="idx !== product_group.length - 1" :key="idx + ' border'" class="list-border-category" />
              </template>
            </v-list-item-group>
          </v-list>
        </div>
        <div class="pa-4">
          <div class="d-flex category-action-footer">
            <div>
              <v-btn block height="40" class="text-none btn-action-footer btn-action-reset" @click="resetGroup">
                Reset
              </v-btn>
            </div>
            <div>
              <v-btn block color="primary" height="40" class="text-none btn-action-footer" @click="getProductByGroup">
                {{ $t('product.apply') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.special_type" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <div class="d-flex align-center justify-center py-3 px-4">
          <div class="font-18 font-weight-bold">
            {{ $t('component.special') }}
          </div>
          <v-btn icon class="btn-close-dialog" @click="dialog.special_type = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-list class="list-filter-category pb-0">
            <v-list-item @click="removeSpecialType()">
              <v-list-item-title>
                {{ $t('layout.all') }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="list-border-category" />
            <template v-for="(item, idx) in special_type">
              <v-list-item :key="idx + ' single'" @click="selectSpecialType(item)">
                <v-list-item-title>
                  {{ $t('component.' + item.type) }}
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="idx !== special_type.length - 1" :key="idx + ' border'" class="list-border-category" />
            </template>
          </v-list>
        </div>
      </v-card>
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
                      :items="temp_product"
                      :loading="isLoading"
                      :search-input.sync="search"
                      hide-selected
                      hide-details
                      prepend-inner-icon="mdi-arrow-left"
                      :placeholder="$t('component.search_product')"
                      :menu-props="{ closeOnContentClick: true }"
                      solo
                      height="56"
                      hide-no-data
                      item-value="id"
                      item-text="name"
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
                    </v-autocomplete>
                  </div>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <div class="menu-bottom">
      <div class="wrap-menu-bottom">
        <v-container :class="['d-flex', { 'pa-0': $vuetify.breakpoint.width > 600 }]">
          <v-row :class="[{ 'ma-0 fill-height': $vuetify.breakpoint.width > 600 }]">
            <v-col cols="12">
              <div class="d-flex fill-height align-center justify-space-between">
                <div v-if="stockInCart.qty === 0" class="white--text font-16 font-weight-bold">
                  {{ $t('product.my_cart') }}
                </div>
                <div v-else class="white--text font-16 font-weight-bold">
                  <div class="font-12">
                    {{ $t('order.sub_total') }}
                  </div>
                  {{ stockInCart.qty + ' ' + $t('product.product') + '- ' }} <span v-mask-money="stockInCart.price" />
                </div>
                <div class="mr-2">
                  <v-btn :to="{ name: 'shopping_cart' }" icon color="white" height="40" width="40" class="ml-auto mr-2">
                    <v-badge v-if="stockInCart.qty > 0" color="red" :content="stockInCart.qty">
                      <v-icon>
                        mdi-cart
                      </v-icon>
                    </v-badge>
                    <v-icon v-else>
                      mdi-cart
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'debounce'
import { getProduct, getProductGroup } from '@/api/product'
import ListProduct from '@/components/product/ListProduct'
import FreeShipping from '@/components/freeShipping/FreeShipping'
import DialogListOutlet from '@/components/outlet/DialogListOutlet'
import NewOrder from '@/components/order/NewOrder'
export default {
  name: 'Home',
  components: {
    ListProduct,
    FreeShipping,
    DialogListOutlet,
    NewOrder
  },
  data() {
    return {
      sheet: {
        search: false
      },
      dialog: {
        outlet: false,
        category: false,
        special_type: false
      },
      handle_back: {
        page_to: 1,
        scroll_to: 0
      },
      scroll_to: 0,
      settingScroll: {
        product: false,
        group: false
      },
      params: {
        search_column: [],
        search_operator: [],
        search_text: [],
        page: 1,
        per_page: 20
      },
      params_group: {
        page: 1,
        per_page: 20
      },
      params_search: {
        page: 1,
        per_page: 20
      },
      dataInCart: {
        item: [],
        remark: 'DELIVERY',
        shipping_address: '',
        notes: '',
        currency_id: 'IDR',
        without_shipping: 1
      },
      dataProduct: [],
      customer: {},
      form: {
        search: ''
      },
      selectedCategory: null,
      product_group: [],
      special_type: [
        { type: 'is_featured' },
        { type: 'is_new_release' },
        { type: 'is_popular' },
        { type: 'is_preorder' },
        { type: 'is_sale' }
      ],
      temp: {
        q: null,
        special_type: null,
        group_id: null,
        group_name: null
      },
      temp_product: [],
      isLoading: false,
      field_search: null,
      search: null,
      new_order: false,
      search_not_found: false
    }
  },
  computed: {
    statusStore() {
      if (!this.$isEmpty(this.$store.state.outlet.selected_outlet)) {
        if (this.$store.state.outlet.selected_outlet.shop_hours_today.length > 0) {
          const working_time = this.$t('layout.until') + ' ' + this.$store.state.outlet.selected_outlet.shop_hours_today[0].fend_time
          return `<span class="font-weight-bold isOpen"> ${this.$store.state.outlet.selected_outlet.store_is_open ? this.$t('layout.open') : this.$t('layout.close')} </span> ${working_time}`
        } else {
          return this.$t('layout.close')
        }
      } else {
        return this.$t('layout.close')
      }
    },
    stockInCart() {
      if (this.dataInCart.item.length > 0) {
        const uniqueIds = []
        const unique = this.dataInCart.item.filter(element => {
          const isDuplicate = uniqueIds.includes(element.product_id)
          if (!isDuplicate) {
            uniqueIds.push(element.product_id)
            return true
          }
        })
        const totalPrice = this.$sum(this.dataInCart.item, 'sub_total')
        return {
          qty: unique.length,
          price: totalPrice
        }
      } else {
        return {
          qty: 0,
          price: 0
        }
      }
    },
    loadedDataProductIds() {
      const ids = []
      if (this.dataProduct.length) {
        this.dataProduct.map(item => {
          ids.push(item.product_group_id)
        })
        return ids
      }
      return ids
    },
    dataParams() {
      var params = {
        page: this.params.page,
        per_page: this.params.per_page
      }
      if (this.params.search_column.length > 0) {
        params.search_column = this.params.search_column
        params.search_operator = this.params.search_operator
        params.search_text = this.params.search_text
      }
      return params
    },
    dataParamsGroup() {
      var params = {
        page: this.params_group.page,
        per_page: this.params_group.per_page
      }
      return params
    },
    paramsText() {
      const arrText = []
      if (!this.$isEmpty(this.$route.query)) {
        if (typeof this.$route.query.q !== 'undefined' && this.$route.query.q) {
          arrText.push(this.$route.query.q)
        }
        if (typeof this.$route.query.group_name !== 'undefined' && this.$route.query.group_name) {
          arrText.push(this.$route.query.group_name)
        }
        if (typeof this.$route.query.special_type !== 'undefined' && this.$route.query.special_type) {
          arrText.push(this.$t('component.' + this.$route.query.special_type))
        }
      }
      return arrText.join(', ')
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
        this.temp_product = []
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
            return data === 'name'
          })
          if (newItem.query.q) {
            if (index === -1) {
              search_column.push('name')
              search_operator.push('like')
              search_text.push(newItem.query.q)
            } else {
              search_column[index] = 'name'
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
        if (typeof newItem.query.group_id !== 'undefined') {
          const index = search_column.findIndex(function(data) {
            return data === 'klasifikasi_id'
          })
          if (newItem.query.group_id) {
            if (index === -1) {
              search_column.push('klasifikasi_id')
              search_operator.push('=')
              search_text.push(newItem.query.group_id)
            } else {
              search_column[index] = 'klasifikasi_id'
              search_operator[index] = '='
              search_text[index] = newItem.query.group_id
            }
          } else {
            if (index !== -1) {
              search_column.splice(index, 1)
              search_operator.splice(index, 1)
              search_text.splice(index, 1)
            }
          }
        }
        if (typeof newItem.query.special_type !== 'undefined') {
          const special_type = [...this.special_type]
          let x = -1
          for (let i = 0; i < special_type.length; i++) {
            const index = search_column.findIndex(function(data) {
              return data === special_type[i].type
            })
            if (index !== -1) {
              x = index
              break
            }
          }
          if (newItem.query.special_type) {
            if (x === -1) {
              search_column.push(newItem.query.special_type)
              search_operator.push('=')
              search_text.push(1)
            } else {
              search_column[x] = newItem.query.special_type
              search_operator[x] = '='
              search_text[x] = 1
            }
          } else {
            if (x !== -1) {
              search_column.splice(x, 1)
              search_operator.splice(x, 1)
              search_text.splice(x, 1)
            }
          }
        }
      }
      this.params.page = 1
      this.params.search_column = [...search_column]
      this.params.search_operator = [...search_operator]
      this.params.search_text = [...search_text]
      this.dataProduct = []
      this.getListProduct()
    }
  },
  async mounted() {
    const LOCAL_ORDER = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order')
    if (LOCAL_ORDER) {
      this.new_order = true
    }
    if (!this.$isEmpty(this.$route.query) && typeof this.$route.query.q !== 'undefined' && this.$route.query.q) {
      this.temp.q = this.$route.query.q
      const index = this.params.search_column.findIndex(function(data) {
        return data === 'name'
      })
      if (index === -1) {
        this.params.search_column.push('name')
        this.params.search_operator.push('like')
        this.params.search_text.push(this.$route.query.q)
      } else {
        this.params.search_text[index] = this.$route.query.q
      }
    }
    if (!this.$isEmpty(this.$route.query) && typeof this.$route.query.group_id !== 'undefined' && this.$route.query.group_id) {
      this.temp.group_id = this.$route.query.group_id
      this.temp.group_name = this.$route.query.group_name
      const index = this.params.search_column.findIndex(function(data) {
        return data === 'klasifikasi_id'
      })
      if (index === -1) {
        this.params.search_column.push('klasifikasi_id')
        this.params.search_operator.push('=')
        this.params.search_text.push(this.$route.query.group_id)
      } else {
        this.params.search_text[index] = this.$route.query.group_id
      }
    }
    if (!this.$isEmpty(this.$route.query) && typeof this.$route.query.special_type !== 'undefined' && this.$route.query.special_type) {
      this.temp.special_type = this.$route.query.special_type
      this.params.search_column.push(this.$route.query.special_type)
      this.params.search_operator.push('=')
      this.params.search_text.push(1)
    }
    this.getDataCart()
    const data_back = JSON.parse(sessionStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_handle_back'))
    if (data_back) {
      this.handle_back = data_back
    }
    if (!this.$isEmpty(this.handle_back) && typeof this.handle_back.page_to !== 'undefined' && this.handle_back.page_to !== '') {
      for (let i = 0; i < this.handle_back.page_to; i++) {
        await this.getListProduct()
      }
    } else {
      await this.getListProduct()
    }
    if (this.$store.state.global.customer && !this.$isEmpty(this.$store.state.global.customer)) {
      this.customer = this.$store.state.global.customer
    }
  },
  methods: {
    getDataCart() {
      const LOCAL_DATA_CART = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
      if (LOCAL_DATA_CART) {
        this.dataInCart = JSON.parse(LOCAL_DATA_CART)
      }
    },
    onScrollProduct: debounce(async function(val) {
      this.scroll_to = window.scrollY + 150
      if (this.settingScroll.product === false) {
        if ((window.innerHeight + window.scrollY + 150) >= document.body.offsetHeight) {
          this.getListProduct()
        }
      }
    }, 500),
    onScrollGroup: debounce(async function(val) {
      if (this.settingScroll.group === false && (val.target.scrollTop + val.target.offsetHeight) >= val.target.scrollHeight) {
        this.getListProductGroup()
      }
    }, 500),
    async getListProduct() {
      try {
        const { data } = await getProduct(this.dataParams)
        this.settingScroll.product = (data.data.length < this.params.per_page)
        const data_product = data.data
        await data_product.map(item => {
          if (!this.loadedDataProductIds.includes(item.klasifikasi_id)) {
            this.dataProduct.push({
              product_group_id: item.klasifikasi_id,
              product_group_name: item.klasifikasi,
              items: data_product.filter(__data => __data.klasifikasi_id === item.klasifikasi_id)
            })
          } else {
            const dataProduct = this.dataProduct.filter(group => {
              return item.klasifikasi_id === group.product_group_id
            })
            const index = dataProduct[0].items.findIndex((e) => e.id === item.id)
            if (index === -1) {
              dataProduct[0].items.push(...data_product.filter(__data => __data.klasifikasi_id === item.klasifikasi_id))
            }
          }
        })
        if (!this.$isEmpty(this.handle_back) && typeof this.handle_back.page_to !== 'undefined' && this.handle_back.page_to === this.params.page) {
          this.$vuetify.goTo(this.handle_back.scroll_to)
          sessionStorage.removeItem(process.env.VUE_APP_COOKIE_KEY + '_handle_back')
        }
        this.params.page++
      } catch (e) {
        this.settingScroll.product = true
        this.dataProduct = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async getListSearch(params) {
      if (!this.$isEmpty(params) && typeof params.search_text !== 'undefined' && params.search_text) {
        try {
          params.page = this.params_search.page
          params.per_page = this.params_search.per_page
          params.search_column = 'name'
          params.search_operator = 'like'
          const { data } = await getProduct(params)
          data.data.map(item => {
            this.temp_product.push(item)
          })
          this.params_search.page++
        } catch (e) {
          this.search_not_found = true
          this.temp_product = []
        }
      }
    },
    async showDetail(item, product_type = 'product') {
      const obj = {
        page_to: this.params.page - 1,
        scroll_to: this.scroll_to
      }
      sessionStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_handle_back', JSON.stringify(obj))
      this.$router.push({ name: 'product_detail', params: { product_type: product_type, id: item.id }}).catch(e => {})
    },
    openDialogOutlet() {
      this.dialog.outlet = true
    },
    openDialogCategory() {
      this.getListProductGroup()
      this.dialog.category = true
    },
    closeDialogCategory() {
      this.temp.group_id = null
      this.temp.group_name = null
      this.dialog.category = false
      this.selectedCategory = null
    },
    async getListProductGroup() {
      try {
        const { data } = await getProductGroup(this.dataParamsGroup)
        this.settingScroll.group = (data.data.length < this.params.group_per_page)
        const data_group = data.data
        await data_group.map(item => {
          this.product_group.push(item)
        })
        this.params_group.page++
      } catch (e) {
        this.settingScroll.group = true
        if (e.statusCode !== 404) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    selectGroup(item) {
      this.temp.group_id = item.id
      this.temp.group_name = item.name
    },
    selectSpecialType(item) {
      this.temp.special_type = item.type
      this.$router.push({
        name: 'home',
        query: this.temp
      }).catch(() => {})
      this.dialog.special_type = false
    },
    removeSpecialType() {
      this.temp.special_type = null
      this.$router.push({
        name: 'home',
        query: this.temp
      }).catch(() => {})
      this.dialog.special_type = false
    },
    getProductByGroup() {
      this.$router.push({
        name: 'home',
        query: this.temp
      }).catch(() => {})
      this.dialog.category = false
    },
    resetGroup() {
      this.selectedCategory = null
      this.temp.group_id = null
      this.temp.group_name = null
      this.$router.push({
        name: 'home',
        query: this.temp
      }).catch(() => {})
      this.dialog.category = false
    },
    removeParams() {
      this.temp.q = null
      this.temp.group_id = null
      this.temp.group_name = null
      this.temp.special_type = null
      this.$router.push({
        name: 'home'
      }).catch(() => {})
      this.search_not_found = false
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
    setParamsSearch: debounce(async function() {
      this.$refs.refsearch.isMenuActive = false
      this.temp.q = this.search
      this.$router.push({
        name: 'home',
        query: this.temp
      }).catch(() => {})
      this.sheet.search = false
    }, 500)
  }
}
</script>
