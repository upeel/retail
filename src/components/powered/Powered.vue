<template lang="">
  <div class="text-center">
    <div class="d-flex align-center justify-center">
      <div class="mr-1 font-12 grey-color-text">
        Powered by
      </div>
      <div class="powered-by-olsera cursor-pointer" @click="gotoOlsera()">
        <img src="@/assets/img/svg/logo-main.svg" alt="Olsera.com">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    gotoOlsera() {
      window.open(
        'https://www.olsera.com/id/online',
        '_blank' // <- This is what makes it open in a new window.
      )
    }
  }
}
</script>
