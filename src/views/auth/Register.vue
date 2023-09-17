<template lang="html">
  <div>
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div class="font-18 font-weight-bold">
                {{ $t('sign_in.register_to_store') }} {{ !$isEmpty($store.state.outlet.selected_outlet) ? $store.state.outlet.selected_outlet.name : '' }}
              </div>
              <v-spacer />
              <v-btn icon :to="{ name: 'account_detail' }">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <div class="d-flex justify-center py-10 primary">
      <div>
        <v-img
          :src="require('@/assets/img/svg/login.svg')"
          height="112"
          width="112"
        />
      </div>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <div class="pa-3">
            <ValidationObserver ref="observer">
              <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                <div class="input-with-label">
                  <label>
                    {{ $t('account.name') }}
                  </label>
                  <v-text-field v-model="form.name" solo height="56" class="shadow-input" :error-messages="errors" />
                </div>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                <div class="input-with-label">
                  <label>
                    {{ $t('account.email') }}
                  </label>
                  <v-text-field v-model="form.email" solo height="56" class="shadow-input" :error-messages="errors" />
                </div>
              </ValidationProvider>
              <l-a-phone-number v-model="form.phone" :label="$t('account.phone_number')" type="solo" />
              <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:8">
                <div class="input-with-label mb-2">
                  <label>
                    {{ $t('account.password') }}
                  </label>
                  <v-text-field v-model="form.password" solo height="56" :error-messages="errors" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" class="shadow-input" @click:append="() => (showPassword = !showPassword)" />
                </div>
              </ValidationProvider>
              <v-btn block color="primary" height="56" class="text-none mb-4" @click="signup()">
                {{ $t('sign_in.register') }}
              </v-btn>
            </ValidationObserver>
            <div class="text-center mt-4 mb-12">
              {{ $t('profile.have_account') }}
              <span class="primary--text font-weight-bold text-d-none cursor-pointer noselect" @click="login()">
                {{ $t('profile.login') }}
              </span>
            </div>
            <powered />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <dialog-select-otp v-model="dialog.select_verification" :phone="form.phone" @click-whatsapp="selectOtp()" @click-call="selectOtp(2)" />
    <dialog-input-otp
      ref="dialogOtpRef"
      v-model="dialog.input_verification"
      :phone="form.phone"
      :expiry-code="expiry_code"
      :type-otp="form_register.use_otp_type"
      :has-error="error_code"
      :disabled="disable_verify"
      @change-input="onChangeOtp"
      @completed-input="onCompleteOtp"
      @verify="verifyAccount"
      @resend-sms="resendCode(1)"
      @resend-call="resendCode(2)"
      @resend-wa="resendCode(3)"
    />
    <dialog-success v-model="dialog.verified" @next="next()" />
  </div>
</template>
<script>
import { preregister, register, verification, resendOtp } from '@/api/auth'
import { getCustomer } from '@/api/customer'
import LAPhoneNumber from '@/components/LAphone/index'
import DialogSelectOtp from '@/components/verification/DialogSelectOtp'
import DialogInputOtp from '@/components/verification/DialogInputOtp'
import DialogSuccess from '@/components/verification/DialogSuccess'
import Powered from '@/components/powered/Powered'
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'
export default {
  name: 'Login',
  components: {
    LAPhoneNumber,
    DialogSelectOtp,
    DialogInputOtp,
    DialogSuccess,
    Powered,
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      dialog: {
        select_verification: false,
        input_verification: false,
        verified: false
      },
      resp_register: {},
      form: {
        name: '',
        email: '',
        phone: '',
        password: ''
      },
      form_register: {
        key_pre_register: '',
        use_otp_type: 3
      },
      form_otp: {
        otp_code: ''
      },
      form_resend: {
        phone: '',
        use_otp_type: 3
      },
      disable_verify: true,
      error_code: false,
      showPassword: false,
      expiry_code: null
    }
  },
  methods: {
    login() {
      this.$router.push({ name: 'login', query: { redirect: this.$route.query.redirect }}).catch(() => {})
    },
    async signup() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        try {
          const { data } = await preregister(this.form)
          this.dialog.select_verification = true
          this.form_register.key_pre_register = data.data.key_pre_register
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async getUser() {
      try {
        const { data } = await getCustomer()
        this.$store.dispatch('save_user', data.data)
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async selectOtp(use_otp_type = 3) {
      this.resetFormOtp()
      this.form_register.use_otp_type = use_otp_type
      try {
        const { data } = await register(this.form_register)
        this.resp_register = Object.assign({}, data)
        delete data.data
        delete data.message
        delete data.error
        delete data.status_code
        await this.$store.dispatch('save_token', data)
        if (typeof this.resp_register.data.detail.expiry_date !== 'undefined') {
          this.expiry_code = this.resp_register.data.detail.expiry_date
        }
        this.dialog.select_verification = false
        this.dialog.input_verification = true
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    onChangeOtp(v) {
      if (this.form_register.use_otp_type === 1 && v.length !== 5) {
        this.disable_verify = true
      } else if (this.form_register.use_otp_type === 2 && v.length !== 4) {
        this.disable_verify = true
      } else if (this.form_register.use_otp_type === 3 && v.length !== 6) {
        this.disable_verify = true
      } else {
        this.disable_verify = false
      }
      this.error_code = false
    },
    onCompleteOtp(v) {
      this.form_otp.otp_code = v
    },
    async verifyAccount() {
      try {
        const { data } = await verification(this.form_otp)
        delete data.data
        delete data.message
        delete data.error
        delete data.status_code
        await this.$store.dispatch('save_token', data)
        await this.getUser()
        this.dialog.input_verification = false
        this.dialog.verified = true
        this.resetFormOtp()
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async resendCode(type = 3) {
      this.resetFormOtp()
      this.form_register.use_otp_type = type
      this.form_resend.phone = this.resp_register.data.phone
      this.form_resend.use_otp_type = type
      try {
        const { data } = await resendOtp(this.form_resend)
        if (typeof data.data.detail.expiry_date !== 'undefined') {
          this.expiry_code = data.data.detail.expiry_date
        }
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    next() {
      this.dialog.verified = false
      const query = this.$route.query.redirect
      if (query) {
        if (query === 'order') {
          this.$router.push({ name: query, params: { id: this.$route.query.id }}).catch(() => {})
        } else {
          this.$router.push({ name: query }).catch(() => {})
        }
      } else {
        this.$router.push({ name: 'account_detail' }).catch(() => {})
      }
    },
    resetFormOtp() {
      this.$refs.dialogOtpRef.handleResetCodeInput()
      if (this.disable_verify === false) {
        this.disable_verify = true
      }
      this.error_code = false
    }
  }
}
</script>

