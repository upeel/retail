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
                {{ $t('merchant.merchant_tnc') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col v-if="!$isEmpty($store.state.outlet.selected_outlet)" cols="12">
          <div v-html="$store.state.outlet.selected_outlet.setting.tnc_store_content" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.push({ name: 'home' }).catch(() => {})
    }
  }
}
</script>
