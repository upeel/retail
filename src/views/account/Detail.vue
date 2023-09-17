<template lang="html">
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
                {{ $t('profile.my_account') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <div>
      <div>
        <div class="primary height-100" />
        <div class="wrap-profile">
          <div>
            <div class="d-flex justify-center p-relative">
              <div class="wrap-img-profile">
                <v-img v-if="!$isEmpty(customer)" :src="customer.photo_md" height="90" width="90" contain class="border-rounded" />
                <v-img v-else :src="require('@/assets/img/png/Iconawesome-user-circle.png')" height="90" width="90" contain class="border-rounded" />
              </div>
              <input v-if="uploadReady" ref="fileInputImage" type="file" accept="image/x-png,image/gif,image/jpeg" class="d-none" @change="onFileInputImageChange($event)">
              <v-btn v-if="!$isEmpty(customer)" fab color="primary" width="24" height="24" class="btn-edit-profile" @click="chooseImage">
                <v-icon size="12">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </div>
            <div v-if="!$isEmpty(customer)" class="text-center font-24 font-weight-bold mt-3">
              {{ customer.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <v-card flat class="card-shadow p-relative mb-4">
            <div v-if="!$isEmpty(customer)" class="px-4 py-2">
              <div>
                <div class="font-12 grey-color-text">
                  {{ $t('profile.loyalty_point') }}
                </div>
                <div class="primary--text font-18 font-weight-bold">
                  {{ customer.join_loyalty_points }}
                </div>
              </div>
            </div>
            <div v-else class="px-4 py-2">
              <div>
                <div class="font-12 grey-color-text">
                  {{ $t('profile.loyalty_point') }}
                </div>
                <router-link :to="{ name: 'login' }" class="primary--text font-18 font-weight-bold text-d-none">
                  {{ $t('profile.sign_in_for_point') }}
                </router-link>
                <div class="mt-2 font-12 grey-color-text">
                  {{ $t('profile.note_loyalty') }}
                </div>
              </div>
            </div>
            <div class="profile-icon-point">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" :class="[`svg-ols-point`, { 'point-account': !$isEmpty(customer) }]">
                <path id="path1" d="M35.1778 2.53087C36.2642 2.21555 37.4256 2.27927 38.471 2.71157C39.5165 3.14386 40.3837 3.919 40.9301 4.90954L43.8403 10.1934C44.2954 11.0199 44.9757 11.7002 45.8021 12.1552L51.0877 15.0671C52.0788 15.613 52.8546 16.48 53.2876 17.5255C53.7205 18.5709 53.7847 19.7326 53.4696 20.8194L51.792 26.6133C51.5294 27.5193 51.5294 28.4812 51.792 29.3873L53.4696 35.1811C53.7838 36.2675 53.7192 37.4284 53.2863 38.4732C52.8535 39.5179 52.0781 40.3844 51.0877 40.9302L45.8037 43.8404C44.9773 44.2954 44.297 44.9757 43.842 45.8021L40.9301 51.0877C40.3842 52.0788 39.5172 52.8547 38.4717 53.2876C37.4263 53.7205 36.2646 53.7847 35.1778 53.4697L29.3839 51.792C28.4779 51.5294 27.5159 51.5294 26.6099 51.792L20.8161 53.4697C19.7297 53.7839 18.5688 53.7192 17.524 53.2864C16.4793 52.8535 15.6128 52.0781 15.067 51.0877L12.1568 45.8004C11.7018 44.974 11.0215 44.2937 10.1951 43.8387L4.90951 40.9302C3.91897 40.3837 3.14383 39.5165 2.71153 38.4711C2.27924 37.4257 2.21551 36.2643 2.53084 35.1778L4.20853 29.384C4.47109 28.4779 4.47109 27.516 4.20853 26.6099L2.53084 20.8194C2.21551 19.733 2.27924 18.5716 2.71153 17.5262C3.14383 16.4807 3.91897 15.6135 4.90951 15.0671L10.1967 12.1568C11.0223 11.702 11.702 11.0224 12.1568 10.1968L15.067 4.90954C15.6135 3.919 16.4807 3.14386 17.5261 2.71157C18.5715 2.27927 19.7329 2.21555 20.8194 2.53087L26.6132 4.20856C27.5193 4.47112 28.4812 4.47112 29.3872 4.20856L35.1778 2.53087Z" />
                <path id="path2" d="M27.9905 41.2873C35.3296 41.2873 41.2792 35.3378 41.2792 27.9986C41.2792 20.6595 35.3296 14.71 27.9905 14.71C20.6514 14.71 14.7018 20.6595 14.7018 27.9986C14.7018 35.3378 20.6514 41.2873 27.9905 41.2873Z" />
                <defs>
                  <linearGradient id="paint0_linear_35_5636" x1="17.6785" y1="13.2748" x2="47.2857" y2="55.6125" gradientUnits="userSpaceOnUse">
                    <stop id="stop1" />
                    <stop id="stop2" offset="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </v-card>
          <v-card v-if="!$isEmpty(customer)" flat class="card-shadow mb-4">
            <v-list class="py-0">
              <v-list-item v-for="(item, idx) in link_user" :key="idx" class="px-2" :to="{ name: item.to }">
                <v-list-item-icon class="align-self-center ma-0 px-3 py-2">
                  <v-icon color="black">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card flat class="card-shadow">
            <v-list class="py-0">
              <v-list-item v-if="$isEmpty(customer)" class="px-2" @click="$router.push({ name: 'shopping_cart' }).catch(() => {})">
                <v-list-item-icon class="align-self-center ma-0 px-3 py-2">
                  <v-icon color="black">
                    mdi-cart
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title>
                    {{ $t('profile.my_cart') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="px-2" @click="goToWhatsApp()">
                <v-list-item-icon class="align-self-center ma-0 px-3 py-2">
                  <v-icon color="black">
                    mdi-whatsapp
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title>
                    {{ $t('profile.chat_store') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <locale-menu />
              <v-list-item v-if="!$isEmpty(customer)" class="px-2 menu-logout" @click="dialog.dialogLogout = true">
                <v-list-item-icon class="align-self-center ma-0 px-3 py-2">
                  <v-icon>
                    mdi-logout
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title>
                    {{ $t('profile.log_out') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
          <template v-if="$isEmpty(customer)">
            <v-btn :to="{ name: 'register' }" block height="56" color="primary" outlined class="text-none mt-6">
              {{ $t('profile.register') }}
            </v-btn>
            <v-btn :to="{ name: 'login' }" block height="56" color="primary" class="text-none mt-4">
              {{ $t('profile.login') }}
            </v-btn>
          </template>
          <div class="text-center mt-10">
            <div>
              <router-link :to="{ name: 'terms_conditions' }" class="primary--text font-14 font-weight-bold text-d-none">
                {{ $t('merchant.merchant_tnc') }}
              </router-link>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog.dialogLogout" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Confirm
        </v-card-title>
        <v-card-text>
          Are you sure to log out?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text class="text-none" @click="dialog.dialogLogout = false">
            No
          </v-btn>
          <v-btn color="primary" text class="text-none" @click="logout()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { logoutUser } from '@/api/auth'
import LocaleMenu from '@/components/locale/Index'
import { changeProfile } from '@/api/customer'
export default {
  components: {
    LocaleMenu
  },
  data() {
    return {
      dialog: {
        dialogLogout: false
      },
      uploadReady: true,
      customer: {},
      link_user: [
        { id: 1, title: this.$t('profile.my_order'), icon: 'mdi-file-document-outline', to: 'orders' },
        { id: 2, title: this.$t('profile.my_cart'), icon: 'mdi-cart', to: 'shopping_cart' },
        { id: 3, title: this.$t('profile.change_account'), icon: 'mdi-account-outline', to: 'profile' },
        { id: 4, title: this.$t('profile.shipping_address'), icon: 'mdi-map', to: 'address' }
      ]
    }
  },
  mounted() {
    if (this.$store.state.global.customer && !this.$isEmpty(this.$store.state.global.customer)) {
      this.customer = this.$store.state.global.customer
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'home' }).catch(() => {})
    },
    chooseImage() {
      this.$refs.fileInputImage.click()
    },
    async onFileInputImageChange(e) {
      const form = new FormData()
      form.append('file', e.target.files[0])
      form.append('name', this.customer.name)
      const headers = {
        'Content-Type': 'multipart/form-data'
      }
      try {
        const { data } = await changeProfile(form, headers)
        this.customer = data.data
        this.$store.dispatch('showAlert', {
          type: 'success',
          show: true,
          message: this.$t('profile.alert_success_change_photo'),
          status_code: 200
        })
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
      this.resetInputImage()
    },
    resetInputImage() {
      this.uploadReady = false
      this.$nextTick(() => {
        this.uploadReady = true
      })
    },
    async logout() {
      try {
        const { data } = await logoutUser()
        await this.$store.dispatch('remove_token')
        this.$store.dispatch('showAlert', {
          type: 'success',
          show: true,
          message: data.message,
          status_code: data.statusCode
        })
        this.dialog.dialogLogout = false
        this.customer = {}
        this.$store.dispatch('save_user', {})
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
    }
  }
}
</script>
