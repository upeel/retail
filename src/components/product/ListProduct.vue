<template lang="html">
  <div class="row-list-product">
    <v-row>
      <v-col cols="12" class="py-2">
        <div class="font-18 font-weight-bold mb-4">
          {{ title }}
        </div>
        <v-row>
          <v-col v-for="(item, idx) in products" :key="idx" :cols="6" :xs="4" :md="3" lg="2">
            <v-card class="product-thumbnail" @click="funcShow(item)">
              <div v-if="item.sell_discount_percentage" class="tag-discount">
                <div class="wrap-tag-discount">
                  <span class="white--text">
                    {{ item.sell_discount_percentage }}
                  </span>
                  <img :src="require('@/assets/img/svg/disc.svg')">
                </div>
              </div>
              <v-img :src="item.photo_md" dark height="171px" class="flex-grow-0" />
              <div class="product-thumbnail__content">
                <div class="product-price">
                  <div>
                    {{ item.fsell_price }}
                  </div>
                  <div v-if="Number(item.market_price) !== 0" v-mask-money-no-currency="item.market_price" class="product-price-disc" />
                </div>
                <div class="font-14 text-overflow-height">
                  {{ item.name }}
                </div>
              </div>
              <v-spacer />
              <div class="product-action flex-grow-0">
                <div v-if="item.format_type_special" :class="[`product-tag-special-type`, { 'sale': item.format_type_special === 'Sale' }]">
                  {{ item.format_type_special }}
                </div>
                <v-spacer />
                <div v-if="item.count_sold_item !== 0" class="font-12">
                  {{ item.fcount_sold_item }} {{ $t('product.sold') }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ListProduct',
  props: {
    products: {
      required: true,
      type: Array
    },
    title: {
      default: '',
      type: String
    },
    funcShow: {
      required: true,
      type: Function
    }
  }
}
</script>
