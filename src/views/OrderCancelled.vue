<template lang="html">
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
        <div class="text-center" style="padding-bottom: 150px;">
          <div class="mt-12 px-2">
            <div class="img-order">
              <svg xmlns="http://www.w3.org/2000/svg" width="219.845" height="156.517" viewBox="0 0 219.845 156.517" class="order_cancelled--img">
                <defs />
                <g transform="translate(0.009 -0.004)">
                  <path class="a" d="M61.83,433.31c3.481,13.452,10.843,25.08,22.477,30.717,24.187,11.715,78.734,5.673,119.444-1.262,21.059-3.587,39.568-13.486,53.014-27.417Z" transform="translate(-59.465 -355.352)" />
                  <path class="a" d="M297.759,58.928H275.422a1.755,1.755,0,1,1,0-3.493h3.863a1.755,1.755,0,1,1,0-3.493h-2.757a1.755,1.755,0,1,1,0-3.493h11.659a33.409,33.409,0,0,0-9.1-2.268c-31.791-3.693-43.141-1.25-47.145,1.26a47,47,0,0,1-16.34,6.48c-19.614,3.661-56.295,8.066-89.541-1.4C109.542,47.8,97.26,55.762,89.9,69.063H301.639a28.743,28.743,0,0,0-2.623-10.56,2.038,2.038,0,0,1-1.256.425Z" transform="translate(-81.91 -44.29)" />
                  <path class="a" d="M50.462,293.19a80.662,80.662,0,0,0,.866,23.469l196.114,6.491a83.2,83.2,0,0,0,13.626-18.8Zm77.566,16.742h-3.861a1.755,1.755,0,1,1,0,3.493H101.829a1.755,1.755,0,1,1,0-3.493h3.863a1.755,1.755,0,1,1,0-3.493h-2.759a1.755,1.755,0,1,1,0-3.493H125.27a1.755,1.755,0,1,1,0,3.493h2.757a1.755,1.755,0,1,1,0,3.493Z" transform="translate(-49.99 -243.31)" />
                  <path class="a" d="M271.757,168.5,57.648,173.209a71.037,71.037,0,0,0-5.128,20H268.006a76,76,0,0,0,3.11-12.751A54.584,54.584,0,0,0,271.757,168.5ZM95.992,183.94H92.13a1.756,1.756,0,1,1,0,3.495H69.793a1.756,1.756,0,1,1,0-3.495h3.863a1.755,1.755,0,1,1,0-3.493H70.9a1.755,1.755,0,1,1,0-3.493H93.235a1.755,1.755,0,1,1,0,3.493h2.757a1.755,1.755,0,1,1,0,3.493Z" transform="translate(-52.02 -143.607)" />
                  <ellipse class="a" cx="89.569" cy="8.24" rx="89.569" ry="8.24" transform="translate(19.651 140.042)" />
                  <g transform="translate(8.85 40.85)">
                    <rect class="b" width="129.628" height="129.628" rx="64.814" transform="translate(36.652 -30.845)" />
                  </g>
                  <line class="c" x2="56" y2="56" transform="translate(82.692 50.099)" />
                  <line class="c" x1="56" y2="56" transform="translate(82.692 50.099)" />
                </g>
              </svg>
            </div>
          </div>
          <div class="mt-10">
            <div class="font-24 font-weight-bold">
              {{ $t('dialog.canceled_order') }}
            </div>
          </div>
          <div class="mt-2 font-14">
            {{ $t('dialog.sorry_your_order_cancelled') }}
          </div>
          <div class="mt-10">
            <div class="font-14">
              {{ $t('dialog.order_no') }}
            </div>
            <div class="mt-2 primary--text font-weight-bold font-24">
              {{ order.order_no }}
            </div>
          </div>
          <div class="mt-10">
            <v-btn block color="#128C7E" height="40" class="border-radius-10 white--text text-none mb-4" @click="goContactSeller">
              <v-icon left>
                mdi-whatsapp
              </v-icon>
              {{ $t('order.contact_seller') }}
            </v-btn>
            <v-btn block color="white" height="40" class="border-radius-10 text-none font-weight-bold" @click="goListOrder">
              {{ $t('profile.my_order') }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="__menu-bottom menu-full">
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
        <v-btn color="primary" x-large block class="text-none" @click="goOrderDetail()">
          {{ $t('dialog.detail_order') }}
        </v-btn>
      </v-col>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      order: {}
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))) {
      this.order = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))
    } else {
      this.$router.push({ name: 'home' }).catch(() => {})
    }
    this.$store.dispatch('remove_cart')
  },
  methods: {
    goContactSeller() {
      if (!this.$isEmpty(this.$store.state.outlet.selected_outlet)) {
        window.open('https://wa.me/' + this.$store.state.outlet.selected_outlet.setting.whatsapp, '_blank')
      }
    },
    goListOrder() {
      this.$router.push({ name: 'orders' }).catch(() => {})
    },
    goOrderDetail() {
      this.$router.push({ name: 'order', params: { id: this.order.id }}).catch(() => {})
      this.$store.dispatch('remove_order')
    }
  }
}
</script>
