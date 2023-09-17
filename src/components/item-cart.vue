<template lang="html">
  <div class="card-cart-list-product">
    <div class="wrap-card-cart-list-product">
      <div class="card-cart-check-product">
        <v-checkbox v-model="item.checked" hide-details color="#1685C7" class="pa-0 ma-0" @change="changeChecked($event, index)" />
      </div>
      <div class="card-cart-content-product">
        <div class="card-cart-title-product">
          {{ item.name }}
        </div>
        <div v-if="$vuetify.breakpoint.width > 600" class="card-cart-variant-name">
          {{ item.product_variant_name }}
          <div v-if="item.weight !== 0">
            <v-icon size="12">
              mdi-brightness-1
            </v-icon>
            <div>
              {{ item.weight }}
            </div>
          </div>
        </div>
        <div class="card-cart-content-item">
          <div class="card-cart-content-item-image">
            <img :src="item.photos.photo_md" :alt="item.name">
          </div>
          <div class="card-cart-content-item-content">
            <div v-if="$vuetify.breakpoint.width < 601" class="card-cart-content-item-detail">
              {{ item.product_variant_name }}
              <div v-if="item.weight !== 0">
                <v-icon size="12">
                  mdi-brightness-1
                </v-icon>
                <div>
                  {{ item.weight }}
                </div>
              </div>
            </div>
            <div class="card-cart-content-item-price">
              <span v-mask-money="item.sell_price" />
              <span v-if="Number(item.market_price) > 0" v-mask-money-no-currency="item.market_price" class="market-price" />
            </div>
            <div class="card-cart-content-item-action">
              <div v-if="item.loyalty_points !== ''" class="card-cart-content-point">
                {{ item.loyalty_points }}
              </div>
              <v-spacer />
              <div class="card-cart-content-qty">
                <div class="input-plus-minus-qty">
                  <v-text-field v-model="item.qty" hide-details dense outlined type="number">
                    <template v-slot:append-outer>
                      <v-btn icon small @click="plus(index)">
                        <v-icon>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:prepend>
                      <v-btn icon small @click="minus(index)">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      required: true,
      type: Object
    },
    index: {
      required: true,
      type: Number
    }
  },
  methods: {
    plus(idx) {
      this.$emit('plus', idx)
    },
    minus(idx) {
      this.$emit('minus', idx)
    },
    changeChecked(e, idx) {
      this.$emit('clickcheck', e, idx)
    }
  }
}
</script>
