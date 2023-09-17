<template lang="html">
  <v-dialog v-model="showDialog" persistent content-class="border-radius-10" max-width="350">
    <v-card class="p-relative">
      <v-btn icon class="btn-close-dialog" @click="closeDialog">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <v-btn icon class="btn-outlet-dialog-whatsapp" @click="goToWhatsApp">
        <v-icon>
          mdi-whatsapp
        </v-icon>
      </v-btn>
      <div v-if="!$isEmpty($store.state.outlet.selected_outlet)" class="px-6 pb-6 pt-9 bg-banner-outlet">
        <img :src="url_banner" class="banner-outlet-mask">
        <div class="z-index-2 p-relative">
          <div class="mb-3">
            <div class="d-flex justify-center">
              <div class="image-banner-outlet">
                <img :src="$store.state.outlet.selected_outlet.logo" height="92" width="92" :alt="$store.state.outlet.selected_outlet.name">
              </div>
            </div>
          </div>
          <div class="text-center">
            <div class="banner-title-text">
              {{ $store.state.outlet.selected_outlet.name }}
            </div>
            <div class="banner-subtitle-text">
              {{ $store.state.outlet.selected_outlet.address }}
            </div>
          </div>
        </div>
      </div>
      <div class="pa-4">
        <div class="font-12 mb-1">
          {{ $t('merchant.other_branch') }}
        </div>
        <div class="list-outlet">
          <div v-for="(list, idx) in outlets" :key="idx" class="item-list-outlet">
            <div class="item-list-outlet-icon">
              <img :src="list.logo" height="92" width="92" :alt="list.name">
            </div>
            <div class="item-list-outlet-content">
              <div class="list-outlet-content-title">
                {{ list.name }}
              </div>
              <div v-if="list.store_is_open" class="list-outlet-content-subtitle">
                {{ list.shop_hours_today[0].fstart_time + ' - ' + list.shop_hours_today[0].fend_time }}
              </div>
              <div v-if="list.distance" class="list-content-distance">
                {{ list.distance }} km
              </div>
            </div>
            <div class="ml-2">
              <div v-if="list.store_is_open === 1" class="tag-open">
                {{ $t('layout.open') }}
              </div>
              <div v-if="list.store_is_open === 2" class="tag-open close-soon">
                {{ $t('layout.close_soon') }}
              </div>
              <!-- <div v-if="list.open_soon === true" class="tag-close">
                {{ $t('layout.open_soon') }}
              </div> -->
              <div v-if="list.store_is_open === 0" class="tag-close">
                {{ $t('layout.close') }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10 text-center mb-1">
          <router-link :to="{ name: 'terms_conditions' }" class="primary--text font-14 font-weight-bold text-d-none">
            {{ $t('merchant.merchant_tnc') }}
          </router-link>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>

import { listOutlet } from '@/api/outlet'
import {
  distanceMatrix as distanceMatrixMaps
} from '@/api/maps'
export default {
  props: {
    value: {
      default: false,
      type: Boolean
    },
    item: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      url_banner: require('@/assets/img/svg/bg_list_outlet.svg'),
      outlets: {},
      distance: 0,
      timerInterval: null,
      // open_time: '',
      close_time: ''
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
  mounted() {
    this.getListOutlet()
  },
  methods: {
    closeDialog() {
      this.$emit('input', false)
    },
    goToWhatsApp() {
      if (!this.$isEmpty(this.$store.state.outlet.selected_outlet)) {
        let chatWA = null
        if (!this.$isEmpty(this.$store.state.outlet.selected_outlet.setting)) {
          chatWA = this.$store.state.outlet.selected_outlet.setting.whatsapp
        }
        if (chatWA) {
          window.open('http://wa.me/' + chatWA, '_blank')
        }
      }
    },
    async getListOutlet() {
      try {
        const { data } = await listOutlet()
        this.outlets = data.data
        if (!this.$isEmpty(this.outlets.shop_hours_today)) {
          this.getTimeInterval()
        }
        this.getDistanceFromStore()
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    getTimeInterval() {
      for (var i = 0; i < this.outlets.length; i++) {
        this.close_time = this.outlets[i].shop_hours_today[this.outlets[i].shop_hours_today.length - 1].date + ' ' + this.outlets[i].shop_hours_today[this.outlets[i].shop_hours_today.length - 1].end_time
        // this.open_time = this.outlets[i].shop_hours_today[0].date + ' ' + this.outlets[i].shop_hours_today[0].start_time
        this.getTimeCloseSoon(this.close_time)
      }
    },
    getTimeCloseSoon(time) {
      var countDownDate = new Date(time).getTime()
      const _this = this
      this.timerInterval = setInterval(function() {
        var now = new Date().getTime()
        this.distance = countDownDate - now
        var hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        if (hours < 1) {
          for (var i = 0; i < _this.outlets.length; i++) {
            _this.outlets[i].store_is_open = 2
          }
        }
        if (this.distance < 0) {
          for (var y = 0; y < _this.outlets.length; y++) {
            _this.outlets[y].store_is_open = 0
          }
          clearInterval(this.timerInterval)
        }
      }, 1000)
    },
    async getDistanceFromStore() {
      if (!('geolocation' in navigator)) {
        console.log('Geolocation is not available.')
      }
      navigator.geolocation.getCurrentPosition((pos) => {
        this.getDistance(pos.coords.latitude, pos.coords.longitude)
      }, () => {
        this.$store.state.block_location = true
      })
    },
    async getDistance(latitude, longitude) {
      const currentLocations = []
      currentLocations.push({
        lat: Number(latitude),
        lon: Number(longitude)
      })
      for (var l = 0; l < this.outlets.length; l++) {
        const form = await {
          origin_lat: Number(this.outlets[l].location_lat),
          origin_lon: Number(this.outlets[l].location_lon),
          destination: currentLocations
        }
        await this.checkDistance(form, l)
      }
    },
    async checkDistance(data_form, idx) {
      try {
        const { data } = await distanceMatrixMaps(data_form)
        if (data.rows[0].elements[0].distance.value > 1000) {
          const value = Math.round(data.rows[0].elements[0].distance.value / 1000)
          this.outlets[Number(idx)].distance = Number(value.toFixed(0))
        } else {
          const value = Math.ceil(data.rows[0].elements[0].distance.value / 1000)
          this.outlets[Number(idx)].distance = Number(value.toFixed(0))
        }
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: this.$t('dialog.out_of_range')
        })
      }
    }
  }
}
</script>
