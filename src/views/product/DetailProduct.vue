<template lang="html">
  <div>
    <product-detail v-model="product" :data-in-cart="dataInCart" />
  </div>
</template>
<script>
import ProductDetail from '@/components/product/ProductDetail'
import { getProductDetail } from '@/api/product'
export default {
  components: {
    ProductDetail
  },
  data() {
    return {
      product: {},
      dataInCart: {
        item: [],
        remark: 'DELIVERY',
        shipping_address: '',
        shipping_address_is_different: 1,
        notes: '',
        currency_id: 'IDR',
        without_shipping: 1
      }
    }
  },
  mounted() {
    this.getDataCart()
    this.getProduct()
  },
  methods: {
    getDataCart() {
      const LOCAL_DATA_CART = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
      if (LOCAL_DATA_CART) {
        this.dataInCart = JSON.parse(LOCAL_DATA_CART)
      }
    },
    async getProduct() {
      try {
        const { data } = await getProductDetail(this.$route.params.id)
        this.product = data.data
      } catch (e) {
        this.product = {}
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
