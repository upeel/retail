<template lang="html">
  <v-dialog v-model="showDialog" persistent content-class="border-radius-10" max-width="370">
    <v-card v-if="!$isEmpty($store.state.outlet.selected_outlet)" class="p-relative">
      <div class="d-flex align-center py-3 px-4">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2">
            mdi-truck
          </v-icon>
          <div class="font-18 font-weight-bold">
            {{ $t('product.free_shipping_tnc') }}
          </div>
        </div>
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <div class="custom-scroll-bar container-freeongkir">
        <div class="pb-6">
          <div class="item-tnc-list">
            <div class="item-tnc-icon mr-2">
              <v-img
                :src="require('@/assets/img/svg/icon_freeongkir.svg')"
                height="24"
                width="24"
                contain
              />
            </div>
            <div class="item-tnc-content">
              {{ $t('product.distance_free_shipping') }}
            </div>
            <div class="item-tnc-action">
              {{ $store.state.outlet.selected_outlet.delivery.radius_free_delivery }} km
            </div>
          </div>
          <div class="item-tnc-list">
            <div class="item-tnc-icon mr-2">
              <v-img
                :src="require('@/assets/img/svg/icon_minorder.svg')"
                height="24"
                width="24"
                contain
              />
            </div>
            <div class="item-tnc-content">
              {{ $t('product.min_total_order') }}
            </div>
            <div v-mask-money="$store.state.outlet.selected_outlet.delivery.minimum_order" class="item-tnc-action" />
          </div>
          <div class="item-tnc-list">
            <div class="item-tnc-icon mr-2">
              <v-img
                :src="require('@/assets/img/svg/icon_cost_outside_radius.svg')"
                height="24"
                width="24"
                contain
              />
            </div>
            <div class="item-tnc-content">
              {{ $t('product.cost_out_distance') }}
            </div>
            <div class="item-tnc-action">
              <span v-mask-money="$store.state.outlet.selected_outlet.delivery.cost_outside_radius" /> / km
            </div>
          </div>
          <div class="item-tnc-list">
            <div class="item-tnc-icon mr-2">
              <v-img
                :src="require('@/assets/img/svg/icon_max_radius.svg')"
                height="24"
                width="24"
                contain
              />
            </div>
            <div class="item-tnc-content">
              {{ $t('product.max_free_shipping') }}
            </div>
            <div class="item-tnc-action">
              {{ $store.state.outlet.selected_outlet.delivery.max_radius_delivery }} km
            </div>
          </div>
        </div>
        <!-- <div v-if="$store.state.outlet.selected_outlet.delivery_times.length > 0" class="pb-4">
          <div class="font-18 font-weight-bold mb-3 px-4">
            {{ $t('product.time_shipping') }}
          </div>
          <div class="list-time-freedelivery">
            <div v-for="(item, idx) in $store.state.outlet.selected_outlet.delivery_times" :key="idx" :class="['item-time-freedelivery', { 'store-close' : item.times.length === 0 }]">
              <div class="title-time-freedelivery">
                {{ item.day_name }}
              </div>
              <div v-if="item.times.length > 0" class="action-time-freedelivery">
                {{ item.times[0].ftime }} - {{ item.times[item.times.length - 1].ftime }}
              </div>
              <div v-else class="action-time-freedelivery">
                {{ $t('layout.close') }}
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DialogDetailShipping',
  props: {
    value: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', false)
    }
  }
}
</script>
