<template lang="html">
  <div :class="[{ 'status-is-open' : isOpenStatus }]">
    <div class="overlay" />
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
                {{ order.order_no }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <div v-if="order.status_inquiry === 2" class="banner-store mb-2">
      <v-img :src="require('@/assets/img/png/store.png')" height="120" contain style="padding-top: 82px;" />
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" style="margin-bottom: 72px">
          <!-- <v-card v-if="order.status_inquiry === 2" class="card-border pa-4 mb-2" style="background-color: #FFF2E3;">
            <div class="d-flex align-center">
              <div class="list-content">
                <div class="list-title font-18 font-weight-bold">
                  {{ order.status_desc }}...
                </div>
              </div>
            </div>
          </v-card> -->
          <v-card v-if="order.status === 'P' && order.is_paid === 0" class="card-border mb-2">
            <div class="d-flex align-center">
              <v-icon color="warning" class="mr-2">
                mdi-information
              </v-icon>
              <div class="list-content">
                <div class="list-title font-18 font-weight-bold">
                  {{ order.status_desc }}
                </div>
              </div>
              <v-btn v-if="order.payment_mode_name === 'Xendit Virtual Bank'" :to="{ name: 'va_payment' }" color="warning" height="40" class="soft-shadow text-none font-weight-bold border-10 letter-space-0">
                {{ $t('order.payment') }}
              </v-btn>
            </div>
          </v-card>
          <div v-if="order.status_inquiry !== 1 && order.status_inquiry !== 2 && order.status_inquiry !== 7" class="mb-4">
            <div class="status-order-stepper">
              <div class="status-order-stepper-item">
                <div :class="['status-order-stepper-icon', { 'primary': order.status_inquiry === 3 || order.status === 'S' || order.status === 'T' || order.status === 'R' || order.status === 'Z' }]">
                  <v-icon size="18" color="white">
                    mdi-reload
                  </v-icon>
                </div>
                <div class="status-order-stepper-text">
                  {{ $t('order.processed') }}
                </div>
              </div>
              <hr :class="[`line-order-stepper`, { 'primary': order.status === 'S' || order.status === 'T' || order.status === 'R' || order.status === 'Z' }]">
              <div class="status-order-stepper-item">
                <div :class="[`status-order-stepper-icon`, { 'primary': order.status === 'S' || order.status === 'T' || order.status === 'R' || order.status === 'Z' }]">
                  <v-icon v-if="order.remark === 'SELF PICK-UP'" size="18" color="white">
                    mdi-store
                  </v-icon>
                  <v-icon v-else size="18" color="white">
                    mdi-truck
                  </v-icon>
                </div>
                <div v-if="order.remark === 'SELF PICK-UP'" class="status-order-stepper-text">
                  {{ $t('order.ready_to_pickup') }}
                </div>
                <div v-else class="status-order-stepper-text">
                  {{ $t('order.sent') }}
                </div>
              </div>
              <hr :class="[`line-order-stepper`, { 'primary': order.status === 'T' || order.status === 'R' || order.status === 'Z' }]">
              <div class="status-order-stepper-item">
                <div :class="[`status-order-stepper-icon`, { 'primary': order.status === 'T' || order.status === 'R' || order.status === 'Z' }]">
                  <v-icon size="18" color="white">
                    mdi-package-variant-closed
                  </v-icon>
                </div>
                <div v-if="order.remark === 'SELF PICK-UP'" class="status-order-stepper-text">
                  {{ $t('order.picked_up') }}
                </div>
                <div v-else class="status-order-stepper-text">
                  {{ $t('order.received') }}
                </div>
              </div>
              <hr :class="[`line-order-stepper`, { 'primary': order.status === 'Z' && order.is_paid === 1 }]">
              <div class="status-order-stepper-item">
                <div :class="[`status-order-stepper-icon`, { 'primary': order.status === 'Z' && order.is_paid === 1 }]">
                  <v-icon size="18" color="white">
                    mdi-check-bold
                  </v-icon>
                </div>
                <div class="status-order-stepper-text">
                  {{ $t('order.finished') }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="order.status_inquiry === 7" class="order-cancelled">
            <v-icon color="white">
              mdi-close-circle
            </v-icon>
            <div class="order-cancel">
              {{ $t('order.status.cancelled') }}
            </div>
          </div>
          <template v-if="order.status_inquiry === 3 || order.status === 'S' || order.status === 'T' || order.status === 'R'">
            <div v-if="order.shipping_courier_id === 'GSN' && !$isEmpty(order.shipping_log.gosend) && order.shipping_log.gosend.detail && showDriverGSN" class="mb-4">
              <div class="card-border card-driver-gsn">
                <div class="container-driver">
                  <div class="driver-avatar">
                    <img v-if="order.shipping_log.gosend.detail.driver_photo_url" :src="order.shipping_log.gosend.detail.driver_photo_url" :alt="order.shipping_log.gosend.detail.driver_name ? order.shipping_log.gosend.detail.driver_name : 'Driver'">
                    <img v-else :src="require('@/assets/img/png/Iconawesome-user-circle.png')" :alt="order.shipping_log.gosend.detail.driver_name ? order.shipping_log.gosend.detail.driver_name : 'Driver'">
                  </div>
                  <div class="driver-content">
                    <div v-if="order.shipping_log.gosend.detail.driver_name" class="driver-title">
                      {{ order.shipping_log.gosend.detail.driver_name }}
                    </div>
                    <div v-else class="driver-title">
                      Driver
                    </div>
                  </div>
                  <div v-if="order.shipping_log.gosend.detail.driver_phone" class="driver-action">
                    <v-btn icon color="white" :href="'tel:' + order.shipping_log.gosend.detail.driver_phone">
                      <v-icon size="24">
                        mdi-phone
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mb-4">
              <div class="card-border">
                <div class="d-flex align-center">
                  <div class="font-18 font-weight-bold ml-2">
                    {{ order.status_desc }}
                  </div>
                  <v-spacer />
                  <v-btn color="#128C7E" height="40" class="text-none font-16 border-radius-5 font-weight-bold letter-space-0 white--text" @click="goToWhatsApp()">
                    {{ $t('order.contact_seller') }}
                  </v-btn>
                </div>
              </div>
            </div>
          </template>
          <div class="d-flex align-center pa-1 mb-3">
            <div class="d-flex mr-4">
              <img :src="require('@/assets/img/svg/icon-history.svg')" alt="">
            </div>
            <div class="list-content">
              <div class="list-title font-14 font-weight-bold">
                <span v-if="!$isEmpty(order.translogs) && order.translogs.length > 0 && order.status !== 'X'">
                  {{ order.status_desc }}
                </span>
                <span v-if="order.status === 'X'">
                  {{ $t('order.status.cancelled') }}
                </span>
                <span v-if="$isEmpty(order.translogs) && order.translogs.length === 0 && order.status !== 'X'">
                  Dibeli
                </span>
              </div>
              <div class="list-subtitle font-12 grey-color-text">
                <span v-if="!$isEmpty(order.translogs) && order.translogs.length > 0">
                  {{ order.forder_date }}, {{ order.forder_time }}
                </span>
                <span v-if="order.status === 'X'">
                  {{ order.fmodified_time }}
                </span>
                <span v-if="$isEmpty(order.translogs) && order.translogs.length === 0 && order.status !== 'X'">
                  {{ order.forder_date }}, {{ order.forder_time }}
                </span>
              </div>
            </div>
            <v-btn text color="primary" class="text-none font-weight-bold letter-space-0" @click="isOpenStatus = true">
              {{ $t('order.view_detail') }}
            </v-btn>
          </div>
          <v-card v-if="order.remark === 'SELF PICK-UP'" class="card-border mb-2 px-2 py-3">
            <div class="card-pickup mb-4">
              <div class="icon-pickup mr-2">
                <img :src="require('@/assets/img/png/pickup.png')" alt="">
              </div>
              <div class="list-content">
                <div class="list-title font-18 font-weight-bold black--text">
                  {{ $t('product.take_by_yourself') }}
                </div>
              </div>
            </div>
            <div v-if="!$isEmpty(selected_store)" class="card-pickup-store mb-2">
              <div class="d-flex align-center mb-2">
                <div class="icon-store-pickup mr-2">
                  <img :src="selected_store.logo" :alt="order.store_name">
                </div>
                <div class="list-content">
                  <div class="list-title font-18 font-weight-bold black--text">
                    {{ selected_store.name }}
                  </div>
                </div>
              </div>
              <div class="d-flex align-center">
                <div class="list-content">
                  <div class="list-subtitle font-14 text-two-line">
                    {{ selected_store.address }}
                  </div>
                </div>
                <div class="ml-2">
                  <input id="store_address" type="hidden" :value="selected_store.address">
                  <v-btn icon @click="copyText()">
                    <v-icon>
                      mdi-content-copy
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <div v-if="!$isEmpty(selected_store)" class="card-pickup-store">
              <div class="d-flex align-center">
                <div class="list-content">
                  <div class="list-title font-14 font-weight-bold">
                    <span v-if="selected_store.store_is_open" class="isOpen">
                      {{ $t('layout.open') }}
                    </span>
                    <span v-else class="black--text">
                      {{ $t('layout.close') }}
                    </span>
                  </div>
                  <div v-if="selected_store.shop_hours_today.length > 0" class="list-subtitle font-14 text-two-line" v-html="workingStore" />
                </div>
              </div>
            </div>
          </v-card>
          <template v-else>
            <v-card v-if="order.shipping_delivery_type === '1'" class="card-border px-2 py-3 mb-4">
              <div class="card-pickup">
                <div class="icon-pickup mr-2">
                  <img :src="require('@/assets/img/png/free_delivery.png')" alt="">
                </div>
                <div class="list-content">
                  <div class="list-title font-18 font-weight-bold black--text">
                    {{ $t('global.free_shipping') }}
                  </div>
                </div>
                <div v-if="Number(order.shipping_cost) > 0" class="list-content text-right">
                  <div class="list-subtitle font-12 grey-color-text">
                    {{ $t('order.additional_cost') }}
                  </div>
                  <div class="list-title font-18 font-weight-bold black--text">
                    + <span v-mask-money="order.shipping_cost" />
                  </div>
                </div>
              </div>
            </v-card>
            <v-card v-if="order.shipping_delivery_type === '1'" class="mb-4 free-shipping-exceed">
              {{ $t('order.distance_exceeded') }} ({{ order.shipping_radius_outside }} km). {{ $t('order.free_shipping_additional_cost') }} {{ $store.state.outlet.selected_outlet.delivery.fcost_outside_radius }}/km
            </v-card>
            <v-card class="card-border mb-2 pa-4">
              <div class="card-pickup mb-4">
                <div class="font-18 font-weight-bold black--text mr-4">
                  {{ $t('order.shipping_address') }}
                </div>
                <div class="list-content text-right">
                  <div class="list-title font-18 font-weight-bold black--text">
                    {{ order.shipping_text }}
                  </div>
                </div>
              </div>
              <div class="card-pickup mb-2">
                <div class="list-content">
                  <div class="list-title font-12 black--text text-two-line">
                    {{ order.shipping_address }}
                  </div>
                </div>
                <div class="ml-2 font-12 grey-color-text">
                  {{ order.shipping_radius === 0 ? 1 : order.shipping_radius }} km
                </div>
              </div>
              <v-text-field outlined prepend-inner-icon="mdi-note-text" disabled readonly dense hide-details />
            </v-card>
          </template>
          <v-card class="card-border mt-4 pa-4">
            <div v-for="(item, idx) in order.items" :key="idx" class="d-flex card-order">
              <div class="card-order-item-qty">
                {{ item.qty }}x
              </div>
              <div class="card-order-item-content">
                <div class="card-order-item-title">
                  {{ item.item_name }}
                </div>
                <div class="card-order-item">
                  <div class="card-order-item-image">
                    <img :src="item.product_photo_md" :alt="item.item_name">
                  </div>
                  <div class="card-order-item-detail">
                    <div class="card-order-item-weight">
                      {{ item.weight }}kg
                    </div>
                    <div class="card-order-item-price">
                      <span v-mask-money="item.price" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          <v-card v-if="order.notes !== ''" class="card-border mt-4 pa-4">
            <v-text-field outlined prepend-inner-icon="mdi-note-text" readonly disable dense hide-details v-html="html_order_notes" />
          </v-card>
          <v-card v-if="!$isEmpty(order)" class="card-border mt-4 pa-0">
            <div class="list-price-detail">
              <div class="list-price-item-detail">
                <div>{{ $t('product.sub_total') }}</div>
                <v-spacer />
                <div class="font-weight-bold">
                  ({{ stockInOrderSummary }} {{ $t('product.product') }})
                  <span v-mask-money-no-currency="order.order_amount" />
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>{{ $t('product.discount') }}</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-if="Number(order.discount_sales_amount) > 0" class="font-discount">-</span>
                  <span v-mask-money-no-currency="order.discount_sales_amount" :class="[{ 'font-discount': Number(order.discount_sales_amount) > 0 }]" />
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>Voucher</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-if="Number(order.discount_amount) > 0" class="font-discount">-</span>
                  <span v-mask-money-no-currency="order.discount_amount" :class="[{ 'font-discount': Number(order.discount_amount) > 0 }]" />
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>{{ $t('product.service_cost') }}</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-if="Number(order.service_charge_amount) > 0" v-mask-money-no-currency="order.service_charge_amount" />
                  <span v-else>
                    {{ $t('product.free') }}
                  </span>
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>PPN</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-if="Number(order.tax_amount) > 0" v-mask-money-no-currency="order.tax_amount" />
                  <span v-else>
                    0
                  </span>
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>{{ $t('product.shipping_cost') }}</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-if="Number(order.shipping_cost) > 0" v-mask-money-no-currency="order.shipping_cost" />
                  <span v-else>
                    {{ $t('product.free') }}
                  </span>
                </div>
              </div>
              <div class="list-price-item-detail">
                <div>{{ $t('product.total_payment') }}</div>
                <v-spacer />
                <div class="font-weight-bold">
                  <span v-mask-money-no-currency="order.total_amount" />
                </div>
              </div>
            </div>
          </v-card>
          <!-- <div v-if="Number(data_calculation.point_earn_expected) > 0" class="mt-4">
            <div class="container-point-earn-expected" v-html="$t('product.potential_to_get_points', { point: Number(data_calculation.point_earn_expected) })" />
          </div> -->
          <div class="order-payment-method mt-4">
            <div v-if="order.payment_log && !$isEmpty(order.payment_log)">
              <v-img :src="order.payment_log.payment_image" contain width="50" height="28" :alt="order.payment_log.payment_type" />
            </div>
            <div class="order-payment-method-content">
              <div class="order-payment-method-subtitle">
                {{ $t('product.payment_method') }}
              </div>
              <div v-if="!order.payment_log" class="order-payment-method-title">
                {{ order.payment_mode_name }}
              </div>
              <div v-else class="order-payment-method-title">
                {{ order.payment_log.payment_type }}
              </div>
            </div>
          </div>
          <v-btn v-if="order.status === 'P' && order.is_paid === 0" color="#F44336" height="40" text block class="text-none mt-6 font-weight-bold" @click="dialog.cancel_order = true">
            {{ $t('dialog.cancel_order') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div ref="detailStatus" :class="[`status-fixed`, { 'active': isOpenStatus }]">
      <div class="sheet-bar">
        <div class="sheet-bar-content">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <v-btn icon class="mr-2" @click="isOpenStatus = !isOpenStatus">
                    <v-icon>
                      mdi-arrow-left
                    </v-icon>
                  </v-btn>
                  <div class="font-18 font-weight-bold">
                    {{ $t('order.log_order') }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="px-3">
              <div class="">
                <div v-for="(item, idx) in arrLog" :key="idx" class="logs-item">
                  <div class="logs-item-header">
                    <div class="logs-item-header-icon">
                      <v-icon v-if="idx == 0" color="#6EBE46">
                        mdi-check-circle
                      </v-icon>
                      <div v-else class="logs-item-header-icon-bg" />
                    </div>
                    <div class="logs-item-header-content">
                      <div class="logs-item-header-title">
                        {{ item.action_by_name }}
                      </div>
                    </div>
                    <div class="logs-item-header-action">
                      <div class="logs-item-header-action-text">
                        {{ item.action_time }}
                      </div>
                    </div>
                  </div>
                  <div class="logs-item-body">
                    <div class="logs-item-body-icon">
                      <div v-if="idx !== (order.translogs.length - 1)" class="logs-item-body-icon-line" />
                    </div>
                    <div class="logs-item-body-content">
                      <div class="logs-item-body-content-text">
                        {{ item.action }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-dialog v-model="dialog.cancel_order" max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ $t('dialog.confirm') }}
        </v-card-title>
        <v-card-text>
          {{ $t('dialog.are_you_sure_want_to_cancel_the_order') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text class="text-none" @click="dialog.cancel_order = false">
            No
          </v-btn>
          <v-btn color="primary" text class="text-none" @click="confirmCancel()">
            {{ $t('dialog.yes_cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>
          {{ snackbar.text }}
        </div>
        <v-btn class="transparent" text fab x-small dark @click="snackbar.show = false">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </v-snackbar>

    <div v-if="order.status === 'X' || order.status === 'P' || (order.status === 'A' && order.remark === 'SELF PICK-UP') || order.status === 'Z'" class="menu-bottom">
      <div class="wrap-menu-bottom">
        <v-container :class="['d-flex', { 'pa-0': $vuetify.breakpoint.width > 600 }]">
          <v-row :class="[{ 'ma-0 fill-height': $vuetify.breakpoint.width > 600 }]">
            <v-col cols="12">
              <div class="d-flex fill-height align-center justify-center">
                <v-btn v-if="order.status === 'Z' || order.status === 'X'" class="white--text btn-order-bottom" @click="repeatOrder()">
                  {{ $t('order.repeat') }}
                </v-btn>
                <v-btn v-if="order.status === 'P'" class="white--text btn-order-bottom" @click="goToWhatsApp()">
                  {{ $t('order.contact_seller') }}
                </v-btn>
                <v-btn v-if="order.status === 'A' && order.remark === 'SELF PICK-UP'" class="white--text btn-order-bottom" @click="goToGoogleMaps()">
                  {{ $t('order.store_location') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>
<script>
import { getOutlet } from '@/api/outlet'
import { order, cancelOrder } from '@/api/order'
export default {
  data() {
    return {
      isOpenStatus: false,
      order: {},
      selected_store: {},
      dialog: {
        cancel_order: false
      },
      html_order_notes: '',
      snackbar: {
        show: false,
        text: ''
      }
    }
  },
  computed: {
    showDriverGSN() {
      if (this.order.shipping_courier_id === 'GSN' && !this.$isEmpty(this.order.shipping_log.gosend) && this.order.shipping_log.gosend.detail) {
        if (this.order.shipping_log.gosend.detail.status === 'allocated' || this.order.shipping_log.gosend.detail.status === 'out_for_pickup' || this.order.shipping_log.gosend.detail.status === 'picked' || this.order.shipping_log.gosend.detail.status === 'out_for_delivery' || this.order.shipping_log.gosend.detail.status === 'on_hold') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    searchDriverGSN() {
      if (this.order.shipping_courier_id === 'GSN' && !this.$isEmpty(this.order.shipping_log.gosend) && this.order.shipping_log.gosend.detail) {
        if (this.order.shipping_log.gosend.detail.status === 'Finding Driver' || this.order.shipping_log.gosend.detail.status === 'confirmed') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    workingStore() {
      if (!this.$isEmpty(this.selected_store)) {
        if (this.selected_store.shop_hours_today.length > 0) {
          const working_time = this.selected_store.shop_hours_today[0].fstart_time + ' - ' + this.selected_store.shop_hours_today[0].fend_time
          return `${working_time}`
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    arrLog() {
      const data = []
      if (!this.$isEmpty(this.order)) {
        for (var i = this.order.translogs.length - 1; i >= 0; i--) {
          data.push(this.order.translogs[i])
        }
      }
      return data
    },
    stockInOrderSummary() {
      if (this.order.items.length > 0) {
        const uniqueIds = []
        const unique = this.order.items.filter(element => {
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
    }
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'orders' }).catch(() => {})
    },
    async getOrder() {
      try {
        const { data } = await order(this.$route.params.id)
        this.order = data.data
        await this.getStore(this.order.store_id)
        if (this.order.notes !== '') {
          this.html_order_notes = (this.order.notes).replace(/\n/g, '<br/>')
        }
      } catch (e) {
        this.order = {}
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async getStore(val) {
      try {
        const { data } = await getOutlet(val)
        this.selected_store = data.data
      } catch (e) {
        this.selected_store = {}
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async confirmCancel() {
      try {
        await cancelOrder(this.order.sales_order_id)
        this.$router.push({ name: 'orders' }).catch(() => {})
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
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
    goToGoogleMaps() {
      window.open('https://maps.google.com/?q=' + this.$store.state.outlet.selected_outlet.location_lat + ',' + this.$store.state.outlet.selected_outlet.location_lon)
    },
    repeatOrder(product_type = 'product') {
      this.$router.push({ name: 'product_detail', params: { product_type: product_type, id: this.order.items[0].product_id }}).catch(() => {})
    },
    copyText() {
      const testingCodeToCopy = document.querySelector('#store_address')
      testingCodeToCopy.setAttribute('type', 'text')
      testingCodeToCopy.select()
      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'Copied Successfully' : 'Copy Failed'
        this.snackbar.show = true
        this.snackbar.text = msg
      } catch (err) {
        this.snackbar.show = true
        this.snackbar.text = 'Oops, unable to copy'
      }
      testingCodeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    }
  }
}
</script>
