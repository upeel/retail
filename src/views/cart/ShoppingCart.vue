<template>
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
                {{ $t('product.my_cart') }}
              </div>
              <v-spacer />
              <v-menu v-if="!$isEmpty(dataInCart) && dataInCart.item.length > 0" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn height="40" width="40" icon class="soft-black-color-text" v-bind="attrs" v-on="on">
                    <v-icon dark>
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <v-list dense class="py-0">
                  <v-list-item @click="deleteChecked()">
                    <v-list-item-title class="red--text font-14">
                      {{ $t('product.remove_market') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <div v-if="!$isEmpty(dataInCart) && dataInCart.item.length !== 0" class="detail-store">
      <v-container :class="{ 'pa-0': $vuetify.breakpoint.width < 600 }">
        <v-row :class="{ 'ma-0': $vuetify.breakpoint.width < 600 }">
          <v-col cols="12" :class="['py-0', { 'pa-0': $vuetify.breakpoint.width < 600 }]">
            <div class="wrap-detail-store">
              <div class="list-store">
                <div class="store-detail-cart">
                  <div class="store-detail-cart-avatar">
                    <img :src="$store.state.outlet.selected_outlet.logo" :alt="$store.state.outlet.selected_outlet.name">
                  </div>
                  <div class="store-detail-cart-content">
                    <div class="store-detail-cart-title">
                      {{ $store.state.outlet.selected_outlet.name }}
                    </div>
                    <div v-if="$store.state.outlet.selected_outlet.shop_hours_today && $store.state.outlet.selected_outlet.shop_hours_today.length > 0" class="store-detail-cart-subtitle">
                      <div v-for="(item, key) in $store.state.outlet.selected_outlet.shop_hours_today" :key="key">
                        {{ $t('layout.open') }}
                        <span v-if="$store.state.outlet.selected_outlet.shop_hours_today && $store.state.outlet.selected_outlet.shop_hours_today.length > 0">
                          ({{ item.fstart_time }} - {{ item.fend_time }})
                        </span>
                      </div>
                    </div>
                    <div v-else class="store-detail-cart-subtitle">
                      {{ $t('layout.close') }}
                    </div>
                  </div>
                </div>
              </div>
              <v-spacer />
              <div class="detail-address" @click="openDialogAddress()">
                <div class="wrap-detail-address">
                  <div v-if="!dataInCart.shipping_address || dataInCart.shipping_address === ''" class="content-detail-address">
                    <div class="detail-address-title">
                      {{ $t('order.shipping_address') }}
                    </div>
                  </div>
                  <div v-else class="content-detail-address">
                    <div class="detail-address-title">
                      {{ dataInCart.shipping_name }}
                    </div>
                    <div class="detail-address-subtitle">
                      {{ dataInCart.shipping_radius }} km {{ $t('product.from_store') }}
                    </div>
                  </div>
                  <div class="detail-address-icon">
                    <v-img
                      :src="require('@/assets/img/png/Icon-feather-map-pin@2x.png')"
                      height="24"
                      width="24"
                      min-height="24"
                      min-width="24"
                      contain
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="mt-4">
      <v-container :class="[{ 'pa-4 fill-height': $vuetify.breakpoint.width < 600 }]">
        <v-row :class="{ 'ma-min-4 fill-height': $vuetify.breakpoint.width < 600 }">
          <v-col v-if="!$isEmpty(dataInCart) && dataInCart.item.length !== 0" cols="12" md="8" :class="{ 'pa-4 fill-height': $vuetify.breakpoint.width < 600 }">
            <div class="card--input">
              <div class="card-cart-title">
                <div class="card-cart-title-content">
                  <v-checkbox v-model="checklist_all" hide-details color="#1685C7" class="pa-0 ma-0" @change="checkAll($event)" />
                  <div class="card-cart-text-title">
                    {{ $t('product.product') }}
                  </div>
                </div>
                <v-spacer />
                <div class="card-cart-action">
                  <v-btn icon color="#6EBE46" @click="$router.push({ name: 'home' })">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </div>
              </div>
              <template v-if="dataInCart.item.length !== 0">
                <div v-for="(item, idx) in dataInCart.item" :key="idx">
                  <item-cart :item="item" :index="idx" @plus="plus(idx)" @minus="minus(idx)" @clickcheck="changeChecked" />
                </div>
              </template>
            </div>

            <div v-if="!$isEmpty(dataInCart) && dataInCart.item.length !== 0" class="card--input pa-1 mt-4">
              <v-textarea v-model="dataInCart.notes" hide-details flat height="56" solo dense :placeholder="$t('global.note')" prepend-inner-icon="mdi-message-bulleted" @input="updateNotes()" />
            </div>
          </v-col>

          <v-col v-if="!$isEmpty(dataInCart) && dataInCart.item.length !== 0" cols="12" md="4" :class="{ 'pa-4 fill-height': $vuetify.breakpoint.width < 600 }">
            <div class="card--input cursor-pointer" @click="dialog.voucher = true">
              <div v-if="dataInCart.discount_voucher_id === null || $isEmpty(dataInCart.discount_voucher_detail)" class="wrap-col-discount">
                <div class="wrap-col-discount-title">
                  {{ $t('product.use_vaoucher') }}
                </div>
                <v-spacer />
                <div class="wrap-col-discount-budge">
                  {{ totalVoucher }}
                </div>
              </div>
              <div v-else class="wrap-col-discount">
                <div class="wrap-col-discount-title">
                  {{ dataInCart.discount_voucher_detail.title }}
                </div>
                <v-spacer />
                <div class="wrap-col-discount-budge">
                  <v-btn text small icon color="grey" class="white" @click.stop="removeVoucher()">
                    <v-icon>
                      mdi-close-circle
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <div class="title--shipping mt-4">
              {{ $t('product.shipping') }}
            </div>
            <div class="card--input cursor-pointer mt-4" @click="openDialogShipping()">
              <div v-if="dataInCart.shipping_detail && !$isEmpty(dataInCart.shipping_detail)" class="wrap-col-shipping">
                <div class="wrap-avatar">
                  <img :src="dataInCart.shipping_detail.type === 'free' || dataInCart.shipping_detail.type === 'SelfTake' ? require('@/assets/img/png/' + dataInCart.shipping_detail.logo + '.png') : dataInCart.shipping_detail.logo" :alt="dataInCart.shipping_detail.type">
                </div>
                <div class="wrap-col-content">
                  <div class="wrap-col-shipping-title">
                    {{ dataInCart.shipping_detail.name }}
                  </div>
                  <div class="wrap-col-shipping-subtitle">
                    {{ dataInCart.shipping_detail.shipment_method_description }}
                  </div>
                </div>
                <v-spacer />
                <span v-if="dataInCart.shipping_detail.type !== 'SelfTake' && data_calculation.outside_radius_cost === 0" v-mask-money="dataInCart.shipping_detail.price" class="font-14" />
                <span v-if="dataInCart.shipping_detail.type !== 'SelfTake' && data_calculation.outside_radius_cost !== 0" v-mask-money="data_calculation.outside_radius_cost" class="font-14" />
                <v-icon color="#272727">
                  mdi-chevron-right
                </v-icon>
              </div>
              <div v-else class="wrap-col-shipping">
                <div class="wrap-col-shipping-title">
                  {{ $t('product.choose_shipping') }}
                </div>
                <v-spacer />
                <v-icon color="#272727">
                  mdi-chevron-right
                </v-icon>
              </div>
            </div>
            <div class="card--input free-shipping-exceed mt-4 d-flex align-center">
              <v-icon size="16" color="#1FAD1F" class="mr-2">
                mdi-information-outline
              </v-icon>
              <div>
                {{ $t('product.min_total_order') }} {{ $store.state.outlet.selected_outlet.delivery.fminimum_order }}. {{ $t('product.distance_max') }} {{ $store.state.outlet.selected_outlet.delivery.max_radius_delivery }} km
              </div>
            </div>
            <div class="card--list-order mt-4">
              <div class="wrap-col-order">
                <div class="list-item-order">
                  <div class="item-order-title">
                    {{ $t('product.sub_total') }}
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    ({{ stockInCart }} {{ $t('product.product') }}) <span v-mask-money-no-currency="data_calculation.subtotal" />
                  </div>
                </div>
                <div :class="[`list-item-order`, { 'item-order-discount': Number(data_calculation.discount_sales) > 0 }]">
                  <div class="item-order-title">
                    {{ $t('product.discount') }}
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-if="Number(data_calculation.discount_sales) > 0">- </span>
                    <span v-mask-money-no-currency="data_calculation.discount_sales" />
                  </div>
                </div>
                <div :class="[`list-item-order`, { 'item-order-discount': Number(data_calculation.discount_voucher_amount) > 0 }]">
                  <div class="item-order-title">
                    Voucher
                    <span v-if="Number(data_calculation.discount_voucher_amount) > 0">
                      ({{ data_calculation.discount_voucher_code }})
                    </span>
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-if="Number(data_calculation.discount_voucher_amount) > 0">- </span>
                    <span v-mask-money-no-currency="data_calculation.discount_voucher_amount" />
                  </div>
                </div>
                <div :class="[`list-item-order`, { 'item-order-discount': Number(data_calculation.point_earn_expected) > 0 }]">
                  <div class="item-order-title">
                    Redeem point
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-if="Number(data_calculation.point_earn_expected) > 0">- </span>
                    <span v-mask-money-no-currency="data_calculation.point_earn_expected" />
                  </div>
                </div>
                <div class="list-item-order">
                  <div class="item-order-title">
                    {{ $t('product.service_cost') }}
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    {{ $t('product.free') }}
                  </div>
                </div>
                <div class="list-item-order">
                  <div class="item-order-title">
                    PPN
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-mask-money-no-currency="data_calculation.tax" />
                  </div>
                </div>
                <div class="list-item-order">
                  <div class="item-order-title">
                    {{ $t('product.shipping_cost') }}
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-if="data_calculation.outside_radius_cost !== 0" v-mask-money-no-currency="data_calculation.outside_radius_cost" />
                    <span v-else v-mask-money-no-currency="data_calculation.shipping_tarif" />
                  </div>
                </div>
                <div class="list-item-order">
                  <div class="item-order-title">
                    {{ $t('product.total_payment') }}
                  </div>
                  <v-spacer />
                  <div class="item-order-desc">
                    <span v-mask-money="data_calculation.total" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="Number(data_calculation.point_earn_expected) > 0" class="mt-4">
              <div class="container-point-earn-expected" v-html="$t('product.potential_to_get_points', { point: Number(data_calculation.point_earn_expected) })" />
            </div>
            <v-btn v-if="none_checked === false" color="primary" block x-large class="mt-4 text-none" @click="createOrder">
              {{ $t('product.pay') }}
            </v-btn>
            <v-btn v-else color="primary" disabled block x-large class="mt-4 text-none">
              {{ $t('product.pay') }}
            </v-btn>
          </v-col>

          <v-col v-else cols="12">
            <div class="empty-cart-container">
              <img :src="require('@/assets/img/png/cart.png')" contain>
              <div class="empty-cart-detail">
                {{ $t('product.empty_cart') }}
              </div>
              <v-btn color="primary" block x-large class="btn-empty-cart text-none" @click="goBack">
                {{ $t('product.shop_now') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

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

    <v-dialog v-model="dialog.remove" max-width="310">
      <v-card>
        <v-card-title class="headline">
          {{ $t('dialog.confirm') }}
        </v-card-title>
        <v-card-text>
          {{ $t('dialog.desc_confirm_remove_order') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="dialog.remove = false">
            {{ $t('dialog.no') }}
          </v-btn>
          <v-btn color="primary" outlined @click="deleteItem(remove_item_idx)">
            {{ $t('dialog.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.address" max-width="350">
      <v-card>
        <div class="dialog-title">
          <div class="dialog-text-title">
            {{ $t('product.choice_address') }}
          </div>
          <v-btn icon height="40" width="40" class="btn-close" @click="dialog.address = false">
            <v-icon color="#272727">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <v-card-text class="px-4">
          <div>
            <template v-if="list_address.length > 0">
              <div v-for="(item, idx) in list_address" :key="idx" :class="[`list-item-address mb-2`, { 'active': selected_index_address === idx }]" @click="selectAddress(idx)">
                <div class="d-flex align-center item-select-address add-address-select">
                  <div class="select_address" />
                </div>
                <div class="list-item-content">
                  <div class="list-item-content-title">
                    {{ item.name }}
                  </div>
                  <div class="list-item-content-subtitle">
                    {{ item.address }}
                  </div>
                </div>
              </div>
            </template>
            <div :class="[`list-item-address`, { 'active': selected_index_address === 'new' }]" @click="selectAddress('new')">
              <div class="d-flex align-center item-select-address add-address-select">
                <div class="select_address" />
              </div>
              <div class="list-item-content">
                <div class="list-item-content-title">
                  {{ $t('product.new_address') }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <div class="px-2 pb-2">
          <v-btn color="primary" depressed block class="br-10 text-none" @click="nextAddress()">
            {{ $t('product.choose') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-bottom-sheet v-model="dialog.voucher" :content-class="'bottom-sheet-full sheet-discount'">
      <v-sheet v-touch="{ down: () => swipeDown('Down') }" style="height: 100%">
        <div class="pt-8 px-2 p-relative fill-height">
          <div class="sheet-content">
            <div class="px-2 mb-6">
              <v-text-field :placeholder="$t('discount.input_placeholder_voucher_code')" dense hide-details outlined clearable @input="searchVoucher" @click:clear="clearSearchData" />
            </div>
            <div v-scroll.self="onScroll" class="sheet-content-scroll">
              <div v-for="(item, idx) in vouchers" :key="idx" :class="[`item-voucher`, { 'active': selected_voucher_idx === idx }]" @click="selectVoucher(idx, item)">
                <div class="border-half" />
                <div class="border-half right" />
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <div class="item-voucher-icon">
                      <div class="item-voucher-select">
                        <div />
                      </div>
                    </div>
                    <div class="item-voucher-content">
                      <div class="item-voucher-title">
                        {{ item.title }}
                      </div>
                      <div v-if="Number(item.discount_amount) !== 0" class="item-voucher-subtitle">
                        {{ item.fdiscount_amount }}
                      </div>
                      <div v-else class="item-voucher-subtitle">
                        {{ item.fdiscount_rate }}% OFF
                      </div>
                      <div v-if="item.expiry_date" class="item-voucher-desc">
                        {{ $t('discount.valid_until') + ' ' + item.fexpiry_date }}
                      </div>
                      <div v-else-if="item.active_date" class="item-voucher-desc">
                        {{ $t('discount.valid_on') + ' ' + item.factive_date }}
                      </div>
                    </div>
                  </div>
                  <div class="voucher-detail" @click="openVoucherDetail(idx)">
                    Detail
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class="[`sheet-action`, { 'd-none': selected_voucher_idx === null }]">
            <v-btn color="#F44336" x-large block tile depressed class="text-none white--text font-weight-bold" @click="setVoucher()">
              {{ $t('product.apply') }}
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <v-bottom-sheet v-model="dialog.voucher_detail" :content-class="'bottom-sheet-full sheet-discount'">
      <v-sheet v-touch="{ down: () => swipeDown('Down') }" style="height: 100%">
        <div class="pt-8 px-2 p-relative fill-height">
          <div class="sheet-content">
            <div class="voucher-detail-title-wrap">
              <div class="voucher-detail-title">
                {{ $t('discount.voucher_detail') }}
              </div>
              <v-btn text icon class="btnTrackClose" @click="dialog.voucher_detail = false">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <div v-scroll.self="onScroll" class="sheet-content-scroll">
              <div class="item-voucher active mb-6">
                <div class="border-half" />
                <div class="border-half right" />
                <div class="d-flex align-center">
                  <div class="item-voucher-content">
                    <div class="item-voucher-title">
                      {{ voucher_detail.title }}
                    </div>
                    <div v-if="Number(voucher_detail.discount_amount) !== 0" class="item-voucher-subtitle">
                      {{ voucher_detail.fdiscount_amount }}
                    </div>
                    <div v-else class="item-voucher-subtitle">
                      {{ voucher_detail.fdiscount_rate }}% OFF
                    </div>
                  </div>
                </div>
              </div>
              <div class="voucher-content">
                <div class="voucher-content-items">
                  <div>
                    {{ $t('discount.disc_name') }}
                  </div>
                  <div>
                    {{ voucher_detail.title }}
                  </div>
                </div>
                <div class="voucher-content-items greysoft-bg">
                  <div>
                    {{ $t('discount.amount') }}
                  </div>
                  <div v-if="Number(voucher_detail.discount_amount) !== 0">
                    {{ voucher_detail.fdiscount_amount }}
                  </div>
                  <div v-else>
                    {{ voucher_detail.fdiscount_rate }}% OFF
                  </div>
                </div>
                <div class="voucher-content-items">
                  <div>
                    {{ $t('discount.max_amount') }}
                  </div>
                  <div>
                    {{ voucher_detail.fmax_discount_amount }}
                  </div>
                </div>
                <div class="voucher-content-items greysoft-bg">
                  <div>
                    {{ $t('discount.min_order') }}
                  </div>
                  <div>
                    {{ voucher_detail.fmin_order_amount }}
                  </div>
                </div>
                <div class="voucher-content-items">
                  <div>
                    {{ $t('discount.usage_limit') }}
                  </div>
                  <div v-if="voucher_detail.usage_limit !== 0">
                    {{ voucher_detail.usage_limit }}
                  </div>
                  <div v-else>
                    {{ $t('discount.no_limit') }}
                  </div>
                </div>
                <div class="voucher-content-items greysoft-bg">
                  <div>
                    {{ $t('discount.active_date') }}
                  </div>
                  <div>
                    {{ voucher_detail.factive_date }}
                  </div>
                </div>
                <div class="voucher-content-items">
                  <div>
                    {{ $t('discount.end_date') }}
                  </div>
                  <div v-if="voucher_detail.fexpiry_date === null">
                    {{ $t('discount.no_expiry_date') }}
                  </div>
                  <div v-else>
                    {{ voucher_detail.fexpiry_date }}
                  </div>
                </div>
              </div>
              <div class="mb-2">
                {{ $t('discount.valid_for') }}
              </div>
              <div v-if="voucher_detail.valid_for_all_customers === 1" class="voucher-valid mb-2">
                {{ $t('discount.valid_for_all_cust') }}
              </div>
              <div v-if="voucher_detail.valid_for_all_product_combos === 1" class="voucher-valid mb-2">
                {{ $t('discount.valid_for_all_product_group') }}
              </div>
              <div v-if="voucher_detail.valid_for_all_products === 1" class="voucher-valid mb-2">
                {{ $t('discount.valid_for_all_products') }}
              </div>
              <div v-if="voucher_detail.valid_for_all_brands === 1" class="voucher-valid mb-2">
                {{ $t('discount.valid_for_all_brands') }}
              </div>
            </div>
          </div>
          <div :class="[`sheet-action`, { 'd-none': selected_voucher_idx === null }]">
            <v-btn color="#F44336" x-large block tile depressed class="text-none white--text font-weight-bold" @click="setVoucher()">
              {{ $t('product.apply') }}
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <v-bottom-sheet v-model="dialog.shipping" :content-class="'bottom-sheet-full sheet-shipping'">
      <v-sheet v-touch="{ down: () => swipeDown('Down') }" style="height: 100%">
        <div class="pt-8 px-4 p-relative fill-height">
          <div class="font-18 font-weight-bold">
            {{ $t('product.merchant_shipping') }}
          </div>
          <v-list>
            <template v-if="$store.state.outlet.selected_outlet.delivery.turn_off_private_courier === 0">
              <v-list-item v-for="(item, idx) in dataShippingMerchantFreeDelivery" :key="idx" @click="checkShipping(item)">
                <v-list-item-avatar tile>
                  <v-img
                    :src="require('@/assets/img/png/' + item.logo + '.png')"
                    height="32"
                    width="32"
                    min-height="24"
                    min-width="24"
                    contain
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-14 font-weight-bold">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.id === 1 && !$isEmpty($store.state.outlet.selected_outlet)" class="font-12">
                    Min. {{ $store.state.outlet.selected_outlet.delivery.fminimum_order }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item v-for="(item, idx) in dataShippingMerchantNonFreeDelivery" :key="idx" @click="checkShipping(item)">
                <v-list-item-avatar tile>
                  <v-img
                    :src="require('@/assets/img/png/' + item.logo + '.png')"
                    height="32"
                    width="32"
                    min-height="24"
                    min-width="24"
                    contain
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-14 font-weight-bold">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.id === 1 && !$isEmpty($store.state.outlet.selected_outlet)" class="font-12">
                    Min. {{ $store.state.outlet.selected_outlet.delivery.fminimum_order }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
          <div v-if="checkListShipping" class="font-18 font-weight-bold">
            {{ $t('product.other_shipping') }}
          </div>
          <v-list>
            <template v-for="(item, idx) in list_shipping">
              <v-list-item v-if="item.estimate_range" :key="idx" @click="showShippingDetail(item)">
                <v-list-item-content>
                  <v-list-item-title class="font-14 font-weight-bold">
                    {{ item.type }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.id === 1 && !$isEmpty($store.state.outlet.selected_outlet)" class="font-12">
                    Min. {{ $store.state.outlet.selected_outlet.delivery.fminimum_order }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <div class="d-flex align-center">
                    <div class="estimate-text mr-1">
                      {{ item.festimate_range }}
                    </div>
                    <v-icon size="24">
                      mdi-chevron-right
                    </v-icon>
                  </div>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="dialog.subshipping" persistent max-width="400">
      <v-card>
        <v-btn text icon class="btnTrackClose" @click="dialog.subshipping = false">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <div class="">
          <div class="text-center font-20 font-weight-bold py-3">
            {{ subshipping.type }}
          </div>
          <div class="pb-4">
            <v-list>
              <template v-for="(item, idx) in subshipping.detail">
                <v-list-item :key="idx" @click="checkShipping(item)">
                  <v-list-item-avatar rounded size="32">
                    <v-img :src="item.logo" contain />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-14 font-weight-bold">
                      {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="font-12">
                      {{ item.shipment_method_description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <div class="d-flex align-center">
                      <div class="estimate-text mr-1">
                        <span v-mask-money-no-currency="item.price" />
                      </div>
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { debounce } from 'debounce'
import {
  distanceMatrix as distanceMatrixMaps
} from '@/api/maps'
import ItemCart from '@/components/item-cart'
import { orderCalculation } from '@/api/order'
import { listVoucher } from '@/api/voucher'
import { shippingList } from '@/api/shipping'
import { listAddress } from '@/api/customer'

export default {
  components: {
    ItemCart
  },
  data() {
    return {
      dialog: {
        qtyCheck: false,
        remove: false,
        address: false,
        voucher: false,
        shipping: false,
        subshipping: false,
        voucher_detail: false
      },
      params: {
        page: 1,
        per_page: 10
      },
      settingScroll: false,
      remove_item_idx: 0,
      unavailable_product: '',
      dataInCart: {
        remark: 'DELIVERY',
        item: [],
        shipping_address_id: 0,
        shipping_address: '',
        shipping_name: '',
        shipping_address_is_different: 1,
        notes: '',
        currency_id: 'IDR',
        without_shipping: 1
      },
      list_address: [],
      vouchers: [],
      totalVoucher: 0,
      selected_voucher_idx: null,
      selected_voucher: {},
      checklist_all: true,
      addressFrom: 'btnAddress',
      selected_index_address: null,
      selected_address: {},
      dataShippingMerchantFreeDelivery: [
        { id: 1, type: 'free', name: 'Gratis Antar', remark: 'DELIVERY', logo: 'free_delivery', detail: 'Gratis', price: '0', fprice: 'IDR 0' },
        { id: 3, type: 'SelfTake', name: 'Ambil Sendiri', remark: 'SELF PICK-UP', logo: 'pickup', detai: '', price: '0', fprice: 'IDR 0' }
      ],
      dataShippingMerchantNonFreeDelivery: [
        { id: 3, type: 'SelfTake', name: 'Ambil Sendiri', remark: 'SELF PICK-UP', logo: 'pickup', detai: '', price: '0', fprice: 'IDR 0' }
      ],
      list_shipping: [],
      subshipping: {},
      data_calculation: {},
      temporary_shipping: {},
      none_checked: false,
      voucher_detail: {}
    }
  },
  computed: {
    selectedProduct() {
      const selected = []
      this.dataCart.map((item) => {
        if (item.checked) {
          selected.push(item)
        }
      })
      return selected.reduce((acc, item) => acc + item.quantity, 0)
    },
    validationFastDelete() {
      if (this.selectedItem.length === 0) {
        return true
      } else {
        return false
      }
    },
    paramsVoucher() {
      const params = {
        page: 1,
        per_page: 1000
      }
      params.search_column = []
      params.search_operator = []
      params.search_text = []
      if (this.voucher) {
        params.search_column.push('code')
        params.search_operator.push('=')
        params.search_text.push(this.voucher)
      }
      return params
    },
    stockInCart() {
      if (this.dataInCart.item.length > 0) {
        // qty item
        // return this.dataInCart.item.reduce( function(a, b) {
        //   return a + b['qty']
        // }, 0)
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
    checkListShipping() {
      for (let i = 0; i < this.list_shipping.length; i++) {
        if (this.list_shipping[i].estimate_range !== 0) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    'dataInCart': {
      handler(newItem) {
        if (newItem.item.length > 0) {
          for (let i = 0; i < newItem.item.length; i++) {
            if (!newItem.item[i].checked) {
              this.checklist_all = false
              break
            } else {
              this.checklist_all = true
            }
          }
        } else {
          this.checklist_all = false
        }
      },
      deep: true
    }
  },
  async mounted() {
    await this.getData()
    await this.getAddress()
    await this.getVoucher()
    await this.calculation()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'home' }).catch(() => {})
    },
    getData() {
      const LOCAL_DATA_CART = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
      if (LOCAL_DATA_CART) {
        this.dataInCart = JSON.parse(LOCAL_DATA_CART)
      }
    },
    async getAddress() {
      try {
        const { data } = await listAddress()
        this.list_address = data.data
        const idx_default = this.list_address.findIndex((e) => { return e.is_default === 1 })
        if (idx_default !== -1) {
          this.selected_index_address = idx_default
          this.selected_address = this.list_address[idx_default]
          if (this.dataInCart.shipping_address === '') {
            this.$set(this.dataInCart, 'shipping_address', this.list_address[idx_default].address)
            this.$set(this.dataInCart, 'shipping_address_id', this.list_address[idx_default].id)
            this.$set(this.dataInCart, 'shipping_name', this.list_address[idx_default].name)
            this.$set(this.dataInCart, 'shipping_lat', Number(this.list_address[idx_default].lat))
            this.$set(this.dataInCart, 'shipping_lon', Number(this.list_address[idx_default].lon))
            this.$set(this.dataInCart, 'shipping_city_id', this.list_address[idx_default].city_id)
            this.$set(this.dataInCart, 'shipping_subdistrict_id', this.list_address[idx_default].subdistrict_id)
            const destinations = []
            destinations.push({
              lat: Number(this.list_address[idx_default].lat),
              lon: Number(this.list_address[idx_default].lon)
            })
            const form = await {
              origin_lat: Number(this.$store.state.outlet.selected_outlet.location_lat),
              origin_lon: Number(this.$store.state.outlet.selected_outlet.location_lon),
              destination: destinations
            }
            await this.checkDisctance(form)
          }
        } else {
          this.selected_index_address = 0
        }
      } catch (e) {
        this.list_address = []
        this.selected_index_address = 'new'
        if (e.statusCode !== 404) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async nextAddress() {
      this.dialog.address = false
      if (this.selected_index_address === 'new') {
        this.$router.push({ name: 'add_address', query: { redirect: 'shopping_cart' }})
      } else {
        this.dataInCart.shipping_address = this.list_address[this.selected_index_address].address
        this.dataInCart.shipping_address_id = this.list_address[this.selected_index_address].id
        this.dataInCart.shipping_name = this.list_address[this.selected_index_address].name
        this.dataInCart.shipping_lat = Number(this.list_address[this.selected_index_address].lat)
        this.dataInCart.shipping_lon = Number(this.list_address[this.selected_index_address].lon)
        this.dataInCart.shipping_city_id = this.list_address[this.selected_index_address].city_id
        this.dataInCart.shipping_subdistrict_id = this.list_address[this.selected_index_address].subdistrict_id
        this.dataInCart.shipping_country_id = this.list_address[this.selected_index_address].country_id
        const destinations = []
        destinations.push({
          lat: Number(this.list_address[this.selected_index_address].lat),
          lon: Number(this.list_address[this.selected_index_address].lon)
        })
        const form = await {
          origin_lat: Number(this.$store.state.outlet.selected_outlet.location_lat),
          origin_lon: Number(this.$store.state.outlet.selected_outlet.location_lon),
          destination: destinations
        }

        if (this.addressFrom === 'btnShipping') {
          this.dialog.shipping = true
          await this.getShipping()
        }

        if (typeof this.dataInCart.shipping_detail !== 'undefined' && !this.$isEmpty(this.dataInCart.shipping_detail)) {
          await this.getShipping()
          for (let i = 0; i < this.list_shipping.length; i++) {
            if (this.list_shipping[i].detail.length > 0) {
              for (let x = 0; x < this.list_shipping[i].detail.length; x++) {
                if (this.list_shipping[i].detail[x].shipping_courier_id === this.dataInCart.shipping_detail.shipping_courier_id && this.list_shipping[i].detail[x].shipping_service_type === this.dataInCart.shipping_detail.shipping_service_type) {
                  this.dataInCart.shipping_detail = this.list_shipping[i].detail[x]
                  await this.calculation()
                  break
                }
              }
            }
          }
        }
        await this.checkDisctance(form)
        await this.calculation()
      }
    },
    async checkDisctance(data_form) {
      try {
        const { data } = await distanceMatrixMaps(data_form)
        if (data.rows[0].elements[0].distance.value > 1000) {
          const value = Math.round(data.rows[0].elements[0].distance.value / 1000)
          this.$set(this.dataInCart, 'shipping_radius', Number(value.toFixed(0)))
        } else {
          const value = Math.ceil(data.rows[0].elements[0].distance.value / 1000)
          this.$set(this.dataInCart, 'shipping_radius', Number(value.toFixed(0)))
        }
        this.$store.dispatch('saveDataCart', this.dataInCart)
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    showShippingDetail(obj) {
      this.subshipping = obj
      this.dialog.subshipping = true
    },
    selectAddress(idx) {
      this.selected_index_address = idx
    },
    checkStockById(id, type = 'product') {
      var qty = 0
      const LOCAL_DATA_CART = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
      if (LOCAL_DATA_CART) {
        this.dataInCart = JSON.parse(LOCAL_DATA_CART)
      }
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
    },
    async plus(idx) {
      let product_available = true
      let unavailable_product = ''
      if (this.dataInCart.item[idx].product_combo_id) {
        for (var i = 0; i < this.dataInCart.item[idx].product_combo_items.length; i++) {
          if (this.dataInCart.item[idx].product_combo_items[i].track_inventory) {
            if (this.dataInCart.item[idx].product_combo_items[i].variant_id) {
              const stock_incart = this.checkStockById(this.dataInCart.item[idx].product_combo_items[i].variant_id, 'variant')
              if (this.dataInCart.item[idx].product_combo_items[i].stock_qty - this.dataInCart.item[idx].product_combo_items[i].hold_qty < this.dataInCart.item[idx].product_combo_items[i].qty + stock_incart) {
                product_available = false
                unavailable_product = this.dataInCart.item[idx].product_combo_items[i].name
                break
              }
            } else {
              const stock_incart = this.checkStockById(this.dataInCart.item[idx].product_combo_items[i].id)
              if (this.dataInCart.item[idx].product_combo_items[i].stock_qty - this.dataInCart.item[idx].product_combo_items[i].hold_qty < this.dataInCart.item[idx].product_combo_items[i].qty + stock_incart) {
                product_available = false
                unavailable_product = this.dataInCart.item[idx].product_combo_items[i].name
                break
              }
            }
          }
        }
      } else {
        if (this.dataInCart.item[idx].track_inventory) {
          if (this.dataInCart.item[idx].product_variant_id) {
            const stock_incart = this.checkStockById(this.dataInCart.item[idx].product_variant_id, 'variant')
            if (Number(this.dataInCart.item[idx].stock_qty) - Number(this.dataInCart.item[idx].hold_qty) < 1 + stock_incart) {
              product_available = false
              unavailable_product = this.dataInCart.item[idx].name
            }
          } else {
            const stock_incart = this.checkStockById(this.dataInCart.item[idx].product_id)
            if (Number(this.dataInCart.item[idx].stock_qty) - Number(this.dataInCart.item[idx].hold_qty) < 1 + stock_incart) {
              product_available = false
              unavailable_product = this.dataInCart.item[idx].name
            }
          }
        }
      }

      if (product_available) {
        this.dataInCart.item[idx].qty = Number(this.dataInCart.item[idx].qty) + 1
        if (this.dataInCart.item[idx].checked) {
          await this.calculation()
        } else {
          this.updateDataCart()
        }
      } else {
        this.unavailable_product = unavailable_product
        this.dialog.qtyCheck = true
      }
    },
    async minus(idx) {
      if ((this.dataInCart.item[idx].qty - 1) === 0) {
        this.dialog.remove = !this.dialog.remove
        this.remove_item_idx = idx
      } else {
        this.dataInCart.item[idx].qty = this.dataInCart.item[idx].qty - 1
        if (this.dataInCart.item[idx].checked) {
          await this.calculation()
        } else {
          this.updateDataCart()
        }
      }
    },
    async deleteItem(idx) {
      this.dialog.remove = !this.dialog.remove
      this.dataInCart.item.splice(idx, 1)
      await this.calculation()
      this.updateDataCart()
    },
    updateNotes: debounce(async function() {
      this.updateDataCart()
    }, 1000),
    async checkAll(e) {
      if (this.dataInCart.item.length > 0) {
        for (let i = 0; i < this.dataInCart.item.length; i++) {
          this.$set(this.dataInCart.item[i], 'checked', e)
        }
        await this.calculation()
        for (let i = 0; i < this.dataInCart.item.length; i++) {
          if (this.dataInCart.item[i].checked === false) {
            this.none_checked = true
          } else {
            this.none_checked = false
            break
          }
        }
      }
    },
    async changeChecked(e, idx) {
      this.$set(this.dataInCart.item[idx], 'checked', e)
      await this.calculation()
      for (let i = 0; i < this.dataInCart.item.length; i++) {
        if (this.dataInCart.item[i].checked === false) {
          this.none_checked = true
        } else {
          this.none_checked = false
          break
        }
      }
    },
    updateDataCart() {
      this.$store.dispatch('saveDataCart', this.dataInCart)
    },
    createOrder() {
      if (this.dataInCart.shipping_address === '') {
        this.openDialogAddress()
      } else {
        this.$router.push({ name: 'payment_method' })
      }
    },
    openDialogAddress(from = 'btnAddress') {
      this.dialog.address = true
      if (this.selected_index_address === 'new') {
        this.selected_index_address = 0
      }
      this.addressFrom = from
    },
    async calculation() {
      const data_cart = JSON.parse(JSON.stringify(this.dataInCart))
      if (!this.$isEmpty(this.temporary_shipping)) {
        if (this.temporary_shipping.type === 'SelfTake') {
          data_cart.without_shipping = 1
          data_cart.remark = 'SELF PICK-UP'
        } else {
          data_cart.without_shipping = 0
          data_cart.remark = 'DELIVERY'
        }
        if (this.temporary_shipping.type !== 'SelfTake' && this.temporary_shipping.type !== 'free') {
          data_cart.shipping_courier_id = this.temporary_shipping.shipping_courier_id
          data_cart.shipping_service_type = this.temporary_shipping.shipping_service_type
        } else {
          delete data_cart.shipping_courier_id
          delete data_cart.shipping_service_type
        }
      } else if (!this.$isEmpty(data_cart.shipping_detail)) {
        if (data_cart.shipping_detail.type === 'SelfTake') {
          data_cart.without_shipping = 1
          data_cart.remark = 'SELF PICK-UP'
        } else {
          data_cart.without_shipping = 0
          data_cart.remark = 'DELIVERY'
        }
        if (data_cart.shipping_detail.type !== 'SelfTake' && data_cart.shipping_detail.type !== 'free') {
          data_cart.shipping_courier_id = data_cart.shipping_detail.shipping_courier_id
          data_cart.shipping_service_type = data_cart.shipping_detail.shipping_service_type
        } else {
          delete data_cart.shipping_courier_id
          delete data_cart.shipping_service_type
        }
      }
      const temporary_cart = JSON.parse(JSON.stringify(data_cart))
      temporary_cart.item = temporary_cart.item.filter(e => e.checked === true)
      if (temporary_cart.item.length > 0) {
        try {
          const { data } = await orderCalculation(temporary_cart)
          this.data_calculation = data.data
          if (!this.$isEmpty(this.temporary_shipping)) {
            data_cart.shipping_detail = this.temporary_shipping
          }
          this.dataInCart = data_cart
          this.dataInCart.total = Number(this.data_calculation.total)
          this.$store.dispatch('saveDataCart', this.dataInCart)
          this.dialog.shipping = false
          this.dialog.subshipping = false
          return true
        } catch (e) {
          this.temporary_shipping = {}
          if (e.error_tagging === 'MINIMUM_ORDER_DISCOUNT') {
            delete this.dataInCart.discount_voucher_id
            delete this.dataInCart.discount_voucher_detail
            this.$store.dispatch('saveDataCart', this.dataInCart)
            await this.calculation()
          }
          if (e.error_tagging === 'DISCOUNT_CAN_ONLY_BE_USED_ONCE') {
            delete this.dataInCart.discount_voucher_id
            delete this.dataInCart.discount_voucher_detail
            this.$store.dispatch('saveDataCart', this.dataInCart)
            await this.calculation()
          }
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
          return false
        }
      } else {
        this.data_calculation = {}
        this.dataInCart.total = 0
        this.$store.dispatch('saveDataCart', this.dataInCart)
      }
    },
    onScroll(e) {
      if (this.settingScroll === false) {
        if ((e.target.scrollHeight - e.target.scrollTop) <= e.target.offsetHeight) {
          this.getVoucher()
        }
      }
    },
    searchVoucher: debounce(async function(val) {
      if (val === null) {
        val = ''
      }
      this.search_text = val
      this.vouchers = []
      if (val !== '') {
        this.settingScroll = true
        this.params.page = 1
        this.params.per_page = 20
        this.searching = true
        await this.loadDataSearch()
      } else {
        this.settingScroll = true
        this.params.page = 1
        this.params.per_page = 20
        this.searching = false
        await this.getVoucher()
      }
    }, 1000),
    async clearSearchData() {
      await this.searchVoucher()
    },
    async loadDataSearch() {
      if (this.searching === true && this.search_text !== null) {
        try {
          const params = {
            page: this.params.page++,
            per_page: this.params.per_page,
            search_text: this.search_text,
            search_operator: 'like',
            search_column: 'title'
          }
          const { data } = await listVoucher(params)
          this.settingScroll = (data.data.length < this.params.per_page)
          for (var i in data.data) {
            this.vouchers.push(data.data[i])
          }
        } catch (e) {
          this.vouchers = []
          if (e.statusCode !== 404) {
            this.$store.dispatch('showAlert', {
              type: 'error',
              show: true,
              message: e.message
            })
          }
        }
      }
    },
    async getVoucher() {
      var _params = {
        page: this.params.page++,
        per_page: this.params.per_page
      }
      try {
        const { data } = await listVoucher(_params)
        this.settingScroll = (data.data.length < this.params.per_page)
        this.totalVoucher = data.meta.total
        for (var i in data.data) {
          this.vouchers.push(data.data[i])
        }
      } catch (e) {
        this.vouchers = []
        if (e.statusCode !== 404) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    selectVoucher(idx, item) {
      if (this.selected_voucher_idx === idx) {
        this.selected_voucher_idx = null
        this.selected_voucher = {}
      } else {
        this.selected_voucher_idx = idx
        this.selected_voucher = item
      }
    },
    async setVoucher() {
      this.dialog.voucher = false
      this.$set(this.dataInCart, 'discount_voucher_id', this.selected_voucher.id)
      this.$set(this.dataInCart, 'discount_voucher_detail', this.selected_voucher)
      await this.calculation()
    },
    async removeVoucher() {
      this.selected_voucher_idx = null
      this.selected_voucher = {}
      this.$set(this.dataInCart, 'discount_voucher_id', this.selected_voucher.id)
      this.$set(this.dataInCart, 'discount_voucher_detail', this.selected_voucher)
      await this.calculation()
    },
    swipeDown(direction) {
      if (direction === 'Down') {
        this.dialog.voucher = false
      }
    },
    openDialogShipping() {
      if (this.dataInCart.shipping_address === '') {
        this.openDialogAddress('btnShipping')
      } else {
        this.dialog.shipping = true
        this.getShipping()
      }
    },
    async getShipping() {
      try {
        const params = {
          shipping_lat: this.dataInCart.shipping_lat,
          shipping_lon: this.dataInCart.shipping_lon,
          shipping_city_id: this.dataInCart.shipping_city_id,
          shipping_subdistrict_id: this.dataInCart.shipping_subdistrict_id
        }
        const { data } = await shippingList(params)
        this.list_shipping = data.data
      } catch (e) {
        this.list_shipping = []
        if (e.statusCode !== 404) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async deleteShipping() {
      this.$delete(this.dataInCart, 'shipping_detail')
      this.$set(this.dataInCart, 'without_shipping', 1)
      await this.calculation()
    },
    async checkShipping(item) {
      this.temporary_shipping = item
      this.calculation()
    },
    async deleteChecked() {
      if (this.dataInCart.item.length > 0) {
        var i = this.dataInCart.item.length
        while (i--) {
          if (this.dataInCart.item[i].checked) {
            this.dataInCart.item.splice(i, 1)
          }
        }
      }
      this.updateDataCart()
      this.calculation()
    },
    openVoucherDetail(index) {
      this.voucher_detail = this.vouchers[index]
      this.dialog.voucher_detail = true
    }
  }
}
</script>
