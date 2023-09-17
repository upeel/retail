<template lang="html">
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item class="px-2" v-bind="attrs" v-on="on">
        <v-list-item-avatar height="auto" width="auto" class="align-self-center ma-0 px-3 py-2">
          <v-img :src="getImgUrl(locale)" width="24" height="24" />
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            {{ locale === 'id' ? 'Bahasa Indonesia' : 'English' }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list>
      <v-list-item v-for="item in availableLocales" :key="item" @click="changeLocale(item)">
        <v-list-item-avatar tile width="24" height="24" min-width="24">
          <v-img width="24" height="24" contain :src="getImgUrl(item)" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item === 'id' ? 'Bahasa Indonesia' : 'English' }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { setLocale } from '@/utils/locale'
export default {
  name: 'LocaleMenu',
  computed: {
    availableLocales() {
      return this.$i18n.availableLocales.filter(i => i.code !== this.$i18n.locale)
    },
    locale() {
      return this.$i18n.locale
    }
  },
  methods: {
    getImgUrl(img) {
      const images = require.context('@/assets/img/png/', false, /\.png$/)
      return images('./' + img + '.png')
    },
    changeLocale(locale) {
      this.$i18n.locale = locale
      setLocale(locale)
      this.$router.go()
    }
  }
}
</script>
