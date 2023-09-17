<template lang="html">
  <div>
    <v-expand-transition>
      <div :class="[`new-order`, {'sent' : order.status === 'S' }]">
        <v-container>
          <v-row :class="[{ 'ma-0 fill-height': $vuetify.breakpoint.width > 600 }]">
            <v-col cols="12" :class="[{ 'pa-0': $vuetify.breakpoint.width > 600 }]">
              <row class="new-order-content" @click="handleToOrderDetail(order.id)">
                <v-col cols="6" sm="7" md="8">
                  <div class="new-order-items">
                    <div v-for="(item, idx) in order.items" :key="idx">
                      {{ item.item_name }}
                    </div>
                  </div>
                  <div class="new-order-total">
                    Total {{ order.ftotal_amount }}
                  </div>
                </v-col>
                <v-col cols="6" sm="5" md="4">
                  <div :class="[`white--text new-order-status`, {'sent' : order.status === 'S' }]">
                    <v-icon v-if="order.status === 'S'" size="16" color="white">
                      mdi-truck
                    </v-icon>
                    <v-icon v-else size="18" color="white">
                      mdi-information
                    </v-icon>
                    <div>
                      {{ order.status_desc }}
                    </div>
                  </div>
                </v-col>
              </row>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </div>
</template>
<script>
import { order } from '@/api/order'
export default {
  name: 'NewOrder',
  data() {
    return {
      new_order: {},
      order: {}
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))) {
      this.new_order = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))
      this.getOrder()
    }
  },
  methods: {
    handleToOrderDetail(id) {
      this.$router.push({ name: 'order', params: { id: id }}).catch(() => {})
    },
    async getOrder() {
      try {
        const { data } = await order(this.new_order.id)
        this.order = data.data
      } catch (e) {
        this.order = {}
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
