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
                {{ $t('account.change_email') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <div class="mt-6">
            <div class="input-with-label">
              <label>
                {{ $t('account.email') }}
              </label>
              <v-text-field v-model="form.email" solo height="56" class="shadow-input" />
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="__menu-bottom menu-full">
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
          <v-btn color="primary" block x-large class="text-none" @click="changeName()">
            {{ $t('account.save') }}
          </v-btn>
        </v-col>
      </div>
    </v-container>
  </div>
</template>
<script>
import { changeProfile } from '@/api/customer'
export default {
  data() {
    return {
      form: {
        name: '',
        email: ''
      }
    }
  },
  mounted() {
    if (this.$store.state.global.customer && !this.$isEmpty(this.$store.state.global.customer)) {
      const customer = this.$store.state.global.customer
      this.form.name = customer.name
      this.form.email = customer.email
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'profile' })
    },
    async changeName() {
      try {
        const { data } = await changeProfile(this.form)
        this.$store.dispatch('save_user', data.data)
        this.$router.push({ name: 'profile' })
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    }
  }
}
</script>
