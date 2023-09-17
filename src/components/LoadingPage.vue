<template>
  <div class="mw-app">
    <v-overlay :value="show" opacity=".7" color="white" z-index="999">
      <v-progress-circular indeterminate color="blue" size="64">
        <v-img
          :src="require('@/assets/img/svg/olsera.svg')"
          height="40"
          width="40"
          min-height="20"
          min-width="20"
          contain
        />
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    }
  },
  watch: {
    loading: {
      deep: true,
      handler(value) {
        if (value === true) {
          this.show = true
        } else {
          this.show = false
        }
      }
    }
  }
}
</script>
