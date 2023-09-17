<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <notification />
    <loading />
    <v-snackbar v-model="snackWithButtons" :timeout="timeout" bottom left content-class="snackbar-update">
      New version available!
      <v-spacer />
      <v-btn dark text color="#00f500" @click.native="refreshApp">
        Refresh
      </v-btn>
      <v-btn dark icon @click="snackWithButtons = false">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getCustomer } from '@/api/customer'
import Notification from '@/components/alert/Notification'
import Loading from '@/components/LoadingPage'
export default {
  name: 'App',
  components: {
    Notification,
    Loading
  },
  data() {
    return {
      refreshing: false,
      registration: null,
      snackWithButtons: false,
      timeout: -1
    }
  },
  created() {
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      window.location.reload()
    })
    document.addEventListener('beforeunload', this.checkUser())
  },
  methods: {
    showRefreshUI(e) {
      // Display a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail
      this.snackWithButtons = true
    },
    refreshApp() {
      this.snackWithButtons = false
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) { return }
      this.registration.waiting.postMessage('skipWaiting')
    },
    async checkUser() {
      const token = getToken()
      if (token) {
        try {
          const { data } = await getCustomer()
          this.$store.dispatch('save_user', data.data)
        } catch (e) {
          return false
        }
      }
    }
  }
}
</script>
