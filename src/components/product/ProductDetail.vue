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
                {{ $t('product.detail_product') }}
              </div>
              <v-spacer />
              <v-btn icon height="40" width="40" class="ml-auto mr-2" @click="handleCart">
                <v-badge v-if="stockInCart > 0" color="red" :content="stockInCart">
                  <v-icon color="#0085CD">
                    mdi-cart
                  </v-icon>
                </v-badge>
                <v-icon v-else color="#0085CD">
                  mdi-cart
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container :class="[`margin-prodcut`, { 'pa-0 fill-height': $vuetify.breakpoint.width < 600 }]">
      <v-row :class="{ 'ma-0 fill-height': $vuetify.breakpoint.width < 600 }">
        <v-col cols="12" md="8" :class="{ 'pa-0 fill-height': $vuetify.breakpoint.width < 600 }">
          <v-card elevation="0">
            <div v-if="dataDetailProduct && photoProduct.length > 0">
              <v-carousel id="product-slider" :height="$vuetify.breakpoint.width < 600 ? 392 : 400" :show-arrows="false" hide-delimiter-background continuous>
                <v-carousel-item v-for="(item, key) in photoProduct" :key="key" :src="item.photo_md" reverse-transition="fade-transition" transition="fade-transition" />
              </v-carousel>
            </div>
            <div class="mx-4 pt-4">
              <div class="font-24 font-weight-bold pb-2 blue--text d-flex flex-grow-1">
                <div v-mask-money="formToCart.sell_price" class="mr-2" />
                <div v-if="Number(formToCart.market_price) !== 0" class="grey--text text-decoration-line-through pr-1">
                  <span v-mask-money-no-currency="formToCart.market_price" />
                </div>
              </div>
              <div class="font-18 pb-1 font-weight-medium">
                {{ dataDetailProduct.name }}
              </div>
              <div class="font-12 grey--text mb-2">
                {{ dataDetailProduct.category_name + ' - ' + dataDetailProduct.klasifikasi }}
              </div>
            </div>
            <div v-if="dataDetailProduct.variants && dataDetailProduct.variants.length > 0" class="mx-4">
              <div class="d-flex">
                <div class="wrap-variant-list">
                  <div v-for="(item, idx) in dataDetailProduct.variants" :key="idx" :class="[`col-variant`, { 'active': formToCart.product_variant_id === item.id }]" @click="handleVariant(item.id)">
                    <div class="variant-iamge">
                      <v-img :src="item.photo_md" height="64px" width="64px" />
                    </div>
                    <div class="variant-content">
                      <div class="variant-title">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mx-4 d-md-none">
              <div class="maxmin-product mb-4">
                <div class="wrap-maxmin-product">
                  <div class="content-maxmin">
                    <div v-if="checkStock" class="title-content-maxmin">
                      {{ $t('product.little_stock') }}
                    </div>
                    <div v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0 || Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))" class="subtitle-content-maxmin">
                      <span v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0">
                        {{ $t('product.min_buy') + Math.ceil(Number(dataDetailProduct.min_order)) }}
                      </span>
                      <span v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))">
                        -
                      </span>
                      <span v-if="Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))">
                        {{ $t('product.max_buy') + Math.ceil(Number(dataDetailProduct.max_order)) }}
                      </span>
                    </div>
                  </div>
                  <div class="input-maxmin">
                    <v-text-field v-model="formToCart.qty" hide-details dense outlined type="number">
                      <template v-slot:append-outer>
                        <v-btn icon :disabled="disabled_plus" @click="plus()">
                          <v-icon>
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:prepend>
                        <v-btn icon :disabled="disabled_minus" @click="minus()">
                          <v-icon>
                            mdi-minus
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
            </div>
            <div class="mx-4">
              <div class="font-18 black--text font-weight-medium pb-2">
                {{ $t('product.description') }}
              </div>
              <div class="d-flex">
                <div class="wrap-desc">
                  <div v-if="dataDetailProduct.description" v-html="description_html" />
                  <div v-else class="grey--text">
                    {{ $t('product.no_description') }}
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.width >= 600" cols="12" md="4">
          <div class="col-detail-product">
            <div class="d-none d-md-block mb-4">
              <div class="maxmin-product mb-4 d-flex">
                <div class="wrap-maxmin-product">
                  <div class="content-maxmin">
                    <div v-if="checkStock" class="title-content-maxmin">
                      {{ $t('product.little_stock') }}
                    </div>
                    <div v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0 || Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))" class="subtitle-content-maxmin">
                      <span v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0">
                        {{ $t('product.min_buy') + Math.ceil(Number(dataDetailProduct.min_order)) }}
                      </span>
                      <span v-if="Math.ceil(Number(dataDetailProduct.min_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))">
                        -
                      </span>
                      <span v-if="Math.ceil(Number(dataDetailProduct.max_order)) > 0 && Math.ceil(Number(dataDetailProduct.max_order)) >= Math.ceil(Number(dataDetailProduct.min_order))">
                        {{ $t('product.max_buy') + Math.ceil(Number(dataDetailProduct.max_order)) }}
                      </span>
                    </div>
                  </div>
                  <div class="input-maxmin">
                    <v-text-field v-model="formToCart.qty" hide-details dense outlined type="number">
                      <template v-slot:append-outer>
                        <v-btn icon :disabled="disabled_plus" @click="plus()">
                          <v-icon>
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:prepend>
                        <v-btn icon :disabled="disabled_minus" @click="minus()">
                          <v-icon>
                            mdi-minus
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
              <div v-if="dataDetailProduct.variants && dataDetailProduct.variants.length > 0" class="d-flex">
                <div class="d-flex">
                  <div class="wrap-variant-list">
                    <div v-for="(item, idx) in dataDetailProduct.variants" :key="idx" :class="[`col-variant`, { 'active': formToCart.product_variant_id === item.id }]" @click="handleVariant(item.id)">
                      <div class="variant-iamge">
                        <v-img :src="item.photo_md" height="64px" width="64px" />
                      </div>
                      <div class="variant-content">
                        <div class="variant-title">
                          {{ item.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-2 flex-grow-1 d-flex align-end">
                <div class="font-16 grey--text">
                  {{ $t('product.price') }}
                </div>
                <v-spacer />
                <div class="text-right">
                  <div v-if="Number(formToCart.market_price) !== 0" class="font-14 grey--text text-decoration-line-through">
                    <span v-mask-money-no-currency="formToCart.market_price" />
                  </div>
                  <div v-mask-money="formToCart.sell_price" class="blue--text font-weight-bold font-20" />
                </div>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-grow-1">
                <v-btn color="primary" depressed block large class="text-none font-16 mb-3" @click="handleBuyNow(0)">
                  {{ $t('product.add') + ' ' + formToCart.qty }}
                </v-btn>
                <v-btn outlined color="primary" block large class="text-none font-16" @click="handleBuyNow">
                  {{ $t('product.buy_now') }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="menu-addcart-product">
        <div class="d-flex align-center">
          <v-btn color="white" large class="text-none font-16 border-radius-10" @click="handleBuyNow(0)">
            {{ $t('product.add') + ' ' + formToCart.qty }}
          </v-btn>
          <v-spacer />
          <v-btn color="primary" large class="text-none font-16 border-radius-10" @click="handleBuyNow">
            {{ $t('product.buy_now') }}
          </v-btn>
        </div>
      </div>
    </v-container>

    <v-dialog v-model="dialog.qtyCheck" max-width="310">
      <v-card>
        <v-card-title class="headline">
          {{ $t('product.alert_title_qty_check_failed') }}
        </v-card-title>
        <v-card-text>
          {{ $t('product.alert_desc_qty_check_failed', { 'product': unavailable_product }) }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text class="text-none" @click="dialog.qtyCheck = false">
            {{ $t('dialog.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { debounce } from 'debounce'
export default {
  name: 'ProductDetail',
  props: {
    value: {
      default() {
        return {}
      },
      type: Object
    },
    dataInCart: {
      default() {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      dialog: {
        qtyCheck: false
      },
      dataDetailProduct: {},
      photoProduct: [],
      formToCart: {
        photos: {},
        sub_total: 0,
        qty: 1,
        loyalty_points: '',
        weight: 0
      },
      temporary: {
        products_variant_name: []
      },
      disabled_minus: true,
      disabled_plus: true,
      unavailable_product: '',
      description_html: ''
    }
  },
  computed: {
    'detail_product': {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
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
        return unique.length
      } else {
        return 0
      }
    },
    checkStock() {
      if (this.formToCart.track_inventory === 1) {
        if (Number(this.formToCart.product_variant_id)) {
          const variantCart = this.dataDetailProduct.variants.find(x => x.id === Number(this.formToCart.product_variant_id))
          if (variantCart.is_out_stock) {
            return false
          } else {
            if ((Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty)) - (this.checkStockById(Number(this.formToCart.product_variant_id), 'variant') + this.formToCart.qty) > 10) {
              return false
            } else {
              return true
            }
          }
        } else {
          if (this.dataDetailProduct.is_out_stock) {
            return false
          } else {
            if ((Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty)) - (this.checkStockById(Number(this.formToCart.product_id)) + this.formToCart.qty) > 10) {
              return false
            } else {
              return true
            }
          }
        }
      } else {
        return false
      }
    }
  },
  watch: {
    'detail_product'(newItem) {
      if (!this.$isEmpty(newItem)) {
        this.setupProduct(newItem)
      } else {
        this.setDefault()
      }
    },
    'formToCart.qty': debounce(function(newItem) {
      if (Number(this.dataDetailProduct.min_order) > 0) {
        if (Number(newItem) > Number(this.dataDetailProduct.min_order)) {
          this.disabled_minus = false
        } else {
          this.disabled_minus = true
        }
      } else {
        if (Number(newItem) <= 1) {
          this.disabled_minus = true
        } else {
          this.disabled_minus = false
        }
      }

      if (Number(this.dataDetailProduct.max_order) > 0) {
        if (Number(newItem) < Number(this.dataDetailProduct.max_order)) {
          this.disabled_plus = false
        } else {
          this.disabled_plus = true
        }
      } else {
        this.disabled_plus = false
      }

      this.$nextTick(function() {
        if (Number(newItem) > Number(this.dataDetailProduct.max_order) && Number(this.dataDetailProduct.max_order) > Number(this.dataDetailProduct.min_order)) {
          this.formToCart.qty = Math.ceil(Number(this.dataDetailProduct.max_order))
        } else if (Number(newItem) < Number(this.dataDetailProduct.min_order)) {
          this.formToCart.qty = Math.ceil(Number(this.dataDetailProduct.min_order))
        } else {
          this.formToCart.qty = Math.ceil(Number(this.formToCart.qty))
        }
      })
    }, 500)
  },
  methods: {
    setDefault() {
      this.dataDetailProduct = {}
      this.photoProduct = []
      this.formToCart.photos = {}
      this.formToCart.sub_total = 0
      this.formToCart.qty = 1
      this.temporary.products_variant_name = []
      this.disabled_minus = true
      this.disabled_plus = true
    },
    goBack() {
      this.$router.push({ name: 'home' })
    },
    handleCart() {
      this.$router.push({ name: 'shopping_cart' }).catch(() => {})
    },
    async setupProduct(item) {
      this.dataDetailProduct = await Object.assign({}, item)
      if (Number(this.dataDetailProduct.max_order) >= 0) {
        this.disabled_plus = false
      }
      this.description_html = (this.dataDetailProduct.description).replace(/\n/g, '<br/>')

      if (this.dataDetailProduct.variants.length !== 0) {
        for (var i in this.dataDetailProduct.variants) {
          this.temporary.products_variant_name[this.dataDetailProduct.variants[i].id] = this.dataDetailProduct.variants[i].name
          if (this.dataDetailProduct.track_inventory !== 0) {
            if (Number(this.dataDetailProduct.variants[i].stock_qty > 0)) {
              this.dataDetailProduct.variants[i].item_disable = false
            } else {
              this.dataDetailProduct.variants[i].item_disable = true
            }
          }
        }
        const is_default = this.dataDetailProduct.variants.findIndex((e) => e.is_default === 1)
        if (is_default !== -1) {
          this.formToCart = Object.assign({}, this.formToCart, {
            product_variant_id: this.dataDetailProduct.variants[is_default].id,
            sell_price: Number(this.dataDetailProduct.variants[is_default].sell_price),
            market_price: Number(this.dataDetailProduct.variants[is_default].market_price),
            stock_qty: this.dataDetailProduct.variants[is_default].stock_qty,
            hold_qty: this.dataDetailProduct.variants[is_default].hold_qty
          })
          if (this.dataDetailProduct.variants[is_default].all_photos.length > 0) {
            this.photoProduct = this.dataDetailProduct.variants[is_default].all_photos
          } else {
            this.photoProduct = []
            this.photoProduct.push({
              file_name: this.dataDetailProduct.variants[is_default].file_name,
              photo_md: this.dataDetailProduct.variants[is_default].photo_md,
              photo_xs: this.dataDetailProduct.variants[is_default].photo_xs
            })
          }
        } else {
          this.formToCart = Object.assign({}, this.formToCart, {
            product_variant_id: this.dataDetailProduct.variants[0].id,
            sell_price: Number(this.dataDetailProduct.variants[0].sell_price),
            market_price: Number(this.dataDetailProduct.variants[0].market_price),
            stock_qty: this.dataDetailProduct.variants[0].stock_qty,
            hold_qty: this.dataDetailProduct.variants[0].hold_qty
          })
          if (this.dataDetailProduct.variants[0].all_photos.length > 0) {
            this.photoProduct = this.dataDetailProduct.variants[0].all_photos
          } else {
            this.photoProduct = []
            this.photoProduct.push({
              file_name: this.dataDetailProduct.variants[0].file_name,
              photo_md: this.dataDetailProduct.variants[0].photo_md,
              photo_xs: this.dataDetailProduct.variants[0].photo_xs
            })
          }
        }
      } else {
        this.formToCart = Object.assign({}, this.formToCart, {
          product_variant_id: null,
          sell_price: Number(this.dataDetailProduct.sell_price),
          market_price: Number(this.dataDetailProduct.market_price),
          stock_qty: this.dataDetailProduct.stock_qty,
          hold_qty: this.dataDetailProduct.hold_qty
        })
        if (this.dataDetailProduct.all_photos.length > 0) {
          this.photoProduct = this.dataDetailProduct.all_photos
        } else {
          this.photoProduct.push({
            file_name: this.dataDetailProduct.file_name,
            photo_md: this.dataDetailProduct.photo_md,
            photo_xs: this.dataDetailProduct.photo_xs
          })
        }
      }
      this.sub_total = this.formToCart.sell_price
      this.formToCart = Object.assign({}, this.formToCart, {
        product_combo_id: null,
        product_id: this.dataDetailProduct.id,
        qty: 1,
        name: this.dataDetailProduct.name,
        klasifikasi_id: this.dataDetailProduct.klasifikasi_id,
        non_taxable: this.dataDetailProduct.non_taxable,
        track_inventory: this.dataDetailProduct.track_inventory
      })
    },
    async handleBuyNow(addcart = 1) {
      const subTotal = this.sub_total
      this.formToCart.photos = this.photoProduct[0]
      this.formToCart.sub_total = subTotal
      this.formToCart.checked = true
      this.formToCart.qty = Number(this.formToCart.qty)
      this.formToCart.product_variant_name = await this.temporary.products_variant_name[this.formToCart.product_variant_id]
      if (Number(this.formToCart.product_variant_id)) {
        const variantCart = this.dataDetailProduct.variants.find(x => x.id === Number(this.formToCart.product_variant_id))
        if (variantCart.loyalty_points !== '0.00') {
          this.formToCart.loyalty_points = variantCart.loyalty_points
        }
        this.formToCart.weight = Math.ceil(Number(variantCart.vweight))
      }
      if (this.formToCart.track_inventory === 1) {
        if (Number(this.formToCart.product_variant_id)) {
          const variantCart = this.dataDetailProduct.variants.find(x => x.id === Number(this.formToCart.product_variant_id))
          if (variantCart.is_out_stock) {
            this.dialog.qtyCheck = true
            this.unavailable_product = this.formToCart.name
          } else {
            if (Number(this.dataDetailProduct.max_order) > 0 && (this.checkStockById(Number(this.formToCart.product_id)) + this.formToCart.qty) > Number(this.dataDetailProduct.max_order)) {
              this.dialog.max_order = true
            } else {
              if ((this.checkStockById(Number(this.formToCart.product_variant_id), 'variant') + this.formToCart.qty) > (Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty))) {
                this.dialog.qtyCheck = true
                this.unavailable_product = this.formToCart.name
              } else {
                await this.addToCartFinally()
                if (addcart) {
                  this.$router.push({ name: 'shopping_cart' }).catch(() => {})
                }
              }
            }
          }
        } else {
          if (this.dataDetailProduct.is_out_stock) {
            this.dialog.qtyCheck = true
            this.unavailable_product = this.formToCart.name
          } else {
            if (Number(this.dataDetailProduct.max_order) > 0 && (this.checkStockById(Number(this.formToCart.product_id)) + this.formToCart.qty) > Number(this.dataDetailProduct.max_order)) {
              this.dialog.max_order = true
            } else {
              if ((this.checkStockById(Number(this.formToCart.product_id)) + this.formToCart.qty) > (Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty))) {
                this.dialog.qtyCheck = true
                this.unavailable_product = this.formToCart.name
              } else {
                await this.addToCartFinally()
                if (addcart) {
                  this.$router.push({ name: 'shopping_cart' }).catch(() => {})
                }
              }
            }
          }
        }
      } else {
        await this.addToCartFinally()
        if (addcart) {
          this.$router.push({ name: 'shopping_cart' }).catch(() => {})
        }
      }
    },
    addToCartFinally() {
      this.dataInCart.item.push({ ...this.formToCart })
      this.$store.dispatch('saveDataCart', this.dataInCart)
      this.$store.dispatch('showAlert', {
        type: 'success',
        show: true,
        message: '+' + this.formToCart.qty + this.$t('product.add_to_cart'),
        status_code: 200
      })
    },
    plus() {
      let product_available = true
      if (this.formToCart.track_inventory === 1) {
        if (Number(this.formToCart.product_variant_id)) {
          const variantCart = this.dataDetailProduct.variants.find(y => y.id === Number(this.formToCart.product_variant_id))
          if (variantCart.is_out_stock) {
            this.dialog.qtyCheck = true
            this.unavailable_product = this.formToCart.name
            product_available = false
          } else {
            if ((this.checkStockById(Number(this.formToCart.product_variant_id), 'variant') + this.formToCart.qty + 1) > (Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty))) {
              this.dialog.qtyCheck = true
              this.unavailable_product = this.formToCart.name
              product_available = false
            }
          }
        } else {
          if (this.dataDetailProduct.is_out_stock) {
            this.dialog.qtyCheck = true
            this.unavailable_product = this.formToCart.name
          } else {
            if ((this.checkStockById(Number(this.formToCart.product_id)) + this.formToCart.qty + 1) > (Number(this.formToCart.stock_qty) - Number(this.formToCart.hold_qty))) {
              this.dialog.qtyCheck = true
              this.unavailable_product = this.formToCart.name
              product_available = false
            }
          }
        }
      }
      if (product_available) {
        this.formToCart.qty = Number(this.formToCart.qty) + 1
        this.sub_total = this.sub_total + this.formToCart.sell_price
      } else {
        this.dialog.qtyCheck = true
        this.unavailable_product = this.formToCart.name
      }
    },
    minus() {
      this.formToCart.qty = Number(this.formToCart.qty) - 1
      this.sub_total = this.sub_total - this.formToCart.sell_price
    },
    handleVariant(variant_id) {
      const variant = this.dataDetailProduct.variants.findIndex((e) => e.id === variant_id)
      this.formToCart = Object.assign({}, this.formToCart, {
        product_variant_id: this.dataDetailProduct.variants[variant].id,
        sell_price: Number(this.dataDetailProduct.variants[variant].sell_price),
        market_price: Number(this.dataDetailProduct.variants[variant].market_price),
        stock_qty: this.dataDetailProduct.variants[variant].stock_qty,
        hold_qty: this.dataDetailProduct.variants[variant].hold_qty
      })
      if (this.dataDetailProduct.variants[variant].all_photos.length > 0) {
        this.photoProduct = this.dataDetailProduct.variants[variant].all_photos
      } else {
        this.photoProduct = []
        this.photoProduct.push({
          file_name: this.dataDetailProduct.variants[variant].file_name,
          photo_md: this.dataDetailProduct.variants[variant].photo_md,
          photo_xs: this.dataDetailProduct.variants[variant].photo_xs
        })
      }

      this.sub_total = this.formToCart.sell_price
    },
    checkStockById(id, type = 'product') {
      var qty = 0
      for (var i = 0; i < this.dataInCart.item.length; i++) {
        if (type === 'variant') {
          if (this.dataInCart.item[i].product_variant_id && Number(this.dataInCart.item[i].product_variant_id) === id) {
            qty = qty + this.dataInCart.item[i].qty
          }
          if (this.dataInCart.item[i].product_combo_id) {
            for (var y = 0; y < this.dataInCart.item[i].product_combo_items.length; y++) {
              if (this.dataInCart.item[i].product_combo_items[y].variant_id && Number(this.dataInCart.item[i].product_combo_items[y].variant_id) === id) {
                qty = qty + (this.dataInCart.item[i].qty * this.dataInCart.item[i].product_combo_items[y].qty)
              }
            }
          }
        } else {
          if (this.dataInCart.item[i].product_id && Number(this.dataInCart.item[i].product_id) === id) {
            qty = qty + this.dataInCart.item[i].qty
          }
          if (this.dataInCart.item[i].product_combo_id) {
            for (var z = 0; z < this.dataInCart.item[i].product_combo_items.length; z++) {
              if (this.dataInCart.item[i].product_combo_items[z].id && Number(this.dataInCart.item[i].product_combo_items[z].id) === id) {
                qty = qty + (this.dataInCart.item[i].qty * this.dataInCart.item[i].product_combo_items[z].qty)
              }
            }
          }
        }
      }
      return qty
    }
  }
}
</script>
