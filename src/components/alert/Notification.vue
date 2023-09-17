<template lang="">
  <v-snackbar v-model="$store.state.global.alert.show" top tile content-class="d-flex align-center" :color="$store.state.global.alert.type">
    <div class="d-flex flex-column">
      <div>
        {{ $store.state.global.alert.message }}
      </div>
      <div v-if="$store.state.global.alert.status_code !== 200 && $store.state.global.alert.type !== 'success'">
        {{ $store.state.global.alert.status_code }}
      </div>
    </div>
    <v-spacer />
    <v-btn color="white" icon @click="closeAlert">
      <v-icon>
        mdi-close
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  methods: {
    closeAlert() {
      this.$store.dispatch('showAlert', {
        type: 'error',
        show: false,
        message: '',
        status_code: 500
      })
    }
  }
}
</script>
