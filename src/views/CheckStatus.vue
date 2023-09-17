<template lang="html">
  <div class="__loading">
    <v-overlay :value="overlay" color="white">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      />
    </v-overlay>
  </div>
</template>

<script>
import { order } from '@/api/order'
export default {
  data() {
    return {
      order: {},
      new_order: {},
      overlay: true
    }
  },
  created() {
    this.checkStatus()
  },
  methods: {
    async checkStatus() {
      if (JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))) {
        this.order = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))
      } else {
        this.$router.push({ name: 'home' })
      }

      try {
        const { data } = await order(this.order.id)
        this.new_order = data.data
        this.$store.dispatch('saveDataOrder', data.data)
        if (this.new_order.payment_log) {
          if (this.new_order.payment_log.global_status === 'P') {
            this.$router.push({ name: 'order_payment_pending' }).catch(() => {})
          } else if (this.new_order.payment_log.global_status === 'X') {
            this.$router.push({ name: 'order_payment_failed' }).catch(() => {})
          } else if (this.new_order.payment_log.global_status === 'Z') {
            this.$router.push({ name: 'order_success' }).catch(() => {})
          }
        } else {
          if (this.new_order.status === 'Z') {
            this.$router.push({ name: 'order_success' }).catch(() => {})
          } else if (this.new_order.status === 'X') {
            this.$router.push({ name: 'order_failed' }).catch(() => {})
          }
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>
