<template lang="html">
  <div>
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div class="font-18 font-weight-bold">
                {{ $t('profile.login_to_store') }} {{ !$isEmpty($store.state.outlet.selected_outlet) ? $store.state.outlet.selected_outlet.name : '' }}
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
              <ValidationProvider v-slot="{ errors }" name="emailorphone" rules="required">
                <div class="input-with-label">
                  <label>
                    Email / {{ $t('account.phone_number') }}
                  </label>
                  <v-text-field v-model="form.username" solo height="56" :error-messages="errors" class="shadow-input" />
                </div>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:8">
                <div class="input-with-label mb-2">
                  <label>
                    {{ $t('account.password') }}
                  </label>
                  <v-text-field v-model="form.password" solo height="56" :error-messages="errors" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" class="shadow-input" @click:append="() => (showPassword = !showPassword)" />
                </div>
              </ValidationProvider>
              <v-btn block color="primary" height="56" class="text-none mb-4" @click="login()">
                {{ $t('profile.login') }}
              </v-btn>
            </ValidationObserver>
            <v-btn block color="primary" outlined height="56" class="text-none" @click="dialog.login_as_guest = true">
              {{ $t('profile.login_as_guest') }}
            </v-btn>
            <div class="text-center mt-5">
              {{ $t('profile.not_have_account_yet') }}
              <span class="primary--text font-weight-bold text-d-none cursor-pointer noselect" @click="signup()">
                {{ $t('profile.register_here') }}
              </span>
            </div>
            <div class="text-center mt-3 mb-12">
              <div class="primary--text font-weight-bold text-d-none cursor-pointer noselect" @click="dialog.forgot_password = true">
                {{ $t('profile.forget_password') }}
              </div>
            </div>
            <powered />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <dialog-select-otp v-model="dialog.select_verification" :phone="form_resend.phone" @click-whatsapp="resendCode(1)" @click-call="resendCode(1, 2)" />
    <dialog-input-otp
      v-model="dialog.input_verification"
      :phone="form_resend.phone"
      :expiry-code="expiry_code"
      :type-otp="form_resend.use_otp_type"
      :has-error="error_code"
      :disabled="disable_verify"
      @change-input="onChangeOtp"
      @completed-input="onCompleteOtp"
      @verify="verifyAccount"
      @resend-sms="resendCode(0, 1)"
      @resend-call="resendCode(0, 2)"
      @resend-wa="resendCode(0, 3)"
    />
    <dialog-success v-model="dialog.verified" @next="next()" />
    <v-dialog v-model="dialog.login_as_guest" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <v-btn icon class="btn-close-dialog" @click="dialog.login_as_guest = false">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <div class="d-img-login-as-guest">
          <v-img :src="require('@/assets/img/svg/awesome-user-circle.svg')" height="56" width="56" contain class="mx-auto" />
        </div>
        <div class="py-6 px-4">
          <ValidationObserver ref="obsGuest">
            <ValidationProvider v-slot="{ errors }" name="name" rules="required">
              <div class="input-with-label">
                <label>
                  {{ $t('account.name') }}
                </label>
                <v-text-field v-model="form_guest.guest_name" solo height="56" class="shadow-input" :error-messages="errors" />
              </div>
            </ValidationProvider>
            <l-a-phone-number v-model="form_guest.guest_phone" :label="$t('account.phone_number')" type="solo" />
            <v-btn block color="primary" height="40" class="text-none mb-4" @click="loginGuest()">
              {{ $t('profile.login_as_guest') }}
            </v-btn>
          </ValidationObserver>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.forgot_password" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <v-btn icon class="btn-close-dialog" @click="dialog.forgot_password = false">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <div class="d-img-verificarion">
          <v-img :src="require('@/assets/img/png/use_whatsapp.png')" height="192" width="290" contain class="mx-auto" />
        </div>
        <div class="py-6 px-4">
          <ValidationObserver ref="obsForgot">
            <l-a-phone-number v-model="form_forgot.phone" :label="$t('account.phone_number')" type="solo" />
            <v-btn block color="primary" height="40" class="text-none mb-4" @click="forgPassword(1)">
              {{ $t('component.next') }}
            </v-btn>
          </ValidationObserver>
        </div>
      </v-card>
    </v-dialog>
    <dialog-input-otp
      ref="dialogForgotPassOtpRef"
      v-model="dialog.forg_input_verification"
      :phone="form_forgot.phone"
      :expiry-code="expiry_code"
      :type-otp="form_forgot.use_otp_type"
      :has-error="error_code"
      :disabled="disable_verify"
      @change-input="onChangeForgOtp"
      @completed-input="onCompleteForgOtp"
      @verify="verifyForgAccount"
      @resend-sms="forgPassword(0, 1)"
      @resend-call="forgPassword(0, 2)"
      @resend-wa="forgPassword(0, 3)"
    />
    <v-dialog v-model="dialog.new_password" persistent content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <div class="d-flex align-center py-3 px-4">
          <div class="font-18 font-weight-bold">
            {{ $t('account.change_password') }}
          </div>
          <v-spacer />
          <v-btn icon @click="dialog.new_password = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <div class="pa-6">
          <ValidationObserver ref="obsNewPass">
            <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:8">
              <div class="input-with-label mb-2">
                <label>
                  {{ $t('account.password') }}
                </label>
                <v-text-field v-model="form_pass.new_password" solo height="56" :error-messages="errors" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" class="shadow-input" @click:append="() => (showPassword = !showPassword)" />
              </div>
            </ValidationProvider>
            <v-btn block color="primary" height="40" class="text-none mb-4" @click="setPassword()">
              {{ $t('account.save') }}
            </v-btn>
          </ValidationObserver>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { loginAccount, verification, resendOtp, forgotPassword, forgCheckValidOtp, changePassword } from '@/api/auth'
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
        verified: false,
        login_as_guest: false,
        forgot_password: false,
        forg_input_verification: false,
        new_password: false,
        customer_name: ''
      },
      form_resend: {
        phone: '',
        use_otp_type: 3
      },
      form: {
        username: '',
        password: '',
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        grant_type: 'password'
      },
      form_otp: {
        otp_code: ''
      },
      form_guest: {
        is_guest: 1,
        guest_name: '',
        guest_phone: ''
      },
      form_forgot: {
        phone: '',
        use_otp_type: 3
      },
      form_forgot_otp: {
        phone: '',
        otp_code: ''
      },
      form_pass: {
        otp_code: '',
        phone: '',
        new_password: ''
      },
      disable_verify: true,
      error_code: false,
      showPassword: false,
      expiry_code: null
    }
  },
  watch: {
    'dialog.forg_input_verification': {
      handler(val, oldVal) {
        if (oldVal === true && val === false) {
          this.resetFormOtp()
        }
      },
      deep: true
    }
  },
  methods: {
    signup() {
      this.$router.push({ name: 'register', query: { redirect: this.$route.query.redirect }}).catch(() => {})
    },
    async getUser() {
      try {
        const { data } = await getCustomer()
        this.$store.dispatch('save_user', data.data)
        this.customer_name = data.data.name
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async login() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        try {
          const data = await loginAccount(this.form)
          this.$store.dispatch('save_token', data.data)
          await this.getUser()
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
          this.$store.dispatch('showAlert', {
            type: 'success',
            show: true,
            message: this.$t('login.success_login') + this.customer_name,
            status_code: 200
          })
        } catch (e) {
          if (e.statusCode === 403) {
            await this.$store.dispatch('save_token', e.data.token)
            this.form_resend.phone = e.data.phone
            this.dialog.select_verification = true
          } else {
            this.$store.dispatch('showAlert', {
              type: 'error',
              show: true,
              message: this.$t('login.failed_login')
            })
          }
        }
      }
    },
    onChangeOtp(v) {
      if (this.form_resend.use_otp_type === 1 && v.length !== 5) {
        this.disable_verify = true
      } else if (this.form_resend.use_otp_type === 2 && v.length !== 4) {
        this.disable_verify = true
      } else if (this.form_resend.use_otp_type === 3 && v.length !== 6) {
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
        this.dialog.input_verification = false
        this.dialog.verified = true
      } catch (e) {
        this.error_code = true
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async resendCode(isDialog, type = 3) {
      this.form_resend.use_otp_type = type
      try {
        const { data } = await resendOtp(this.form_resend)
        if (isDialog) {
          this.dialog.input_verification = true
          this.dialog.select_verification = false
        } else {
          this.dialog.input_verification = false
        }
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
    async loginGuest() {
      const isValid = await this.$refs.obsGuest.validate()
      if (isValid) {
        try {
          const data = await loginAccount(this.form_guest)
          this.$store.dispatch('save_token', data.data)
          await this.getUser()
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
          this.$store.dispatch('showAlert', {
            type: 'success',
            show: true,
            message: this.$t('login.success_login') + this.form_guest.guest_name + ' (' + this.$t('login.guest') + ')',
            status_code: 200
          })
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: this.$t('login.failed_login')
          })
        }
      }
    },
    async forgPassword(isDialog, type = 3) {
      this.resetFormOtp()
      this.form_forgot.use_otp_type = type
      const isValid = await this.$refs.obsForgot.validate()
      if (isValid) {
        try {
          const { data } = await forgotPassword(this.form_forgot)
          if (isDialog) {
            this.dialog.forg_input_verification = true
            this.dialog.forgot_password = false
          } else {
            this.dialog.forgot_password = false
          }
          if (typeof data.data.detail.expiry_date_ext !== 'undefined') {
            this.expiry_code = data.data.detail.expiry_date_ext
          }
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    onChangeForgOtp(v) {
      if (this.form_forgot.use_otp_type === 1 && v.length !== 5) {
        this.disable_verify = true
      } else if (this.form_forgot.use_otp_type === 2 && v.length !== 4) {
        this.disable_verify = true
      } else if (this.form_forgot.use_otp_type === 3 && v.length !== 6) {
        this.disable_verify = true
      } else {
        this.disable_verify = false
      }
      this.error_code = false
    },
    onCompleteForgOtp(v) {
      this.form_forgot_otp.otp_code = v
    },
    async verifyForgAccount() {
      this.form_forgot_otp.phone = this.form_forgot.phone
      try {
        await forgCheckValidOtp(this.form_forgot_otp)
        this.dialog.forg_input_verification = false
        this.dialog.new_password = true
        this.resetFormOtp()
      } catch (e) {
        this.error_code = true
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async setPassword() {
      this.form_pass.phone = this.form_forgot.phone
      this.form_pass.otp_code = this.form_forgot_otp.otp_code
      const isValid = await this.$refs.obsNewPass.validate()
      if (isValid) {
        try {
          const { data } = await changePassword(this.form_pass)
          this.dialog.new_password = false
          this.$store.dispatch('showAlert', {
            type: 'success',
            show: true,
            message: data.message,
            status_code: data.statusCode
          })
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    resetFormOtp() {
      this.$refs.dialogForgotPassOtpRef.handleResetCodeInput()
      if (this.disable_verify === false) {
        this.disable_verify = true
      }
      this.error_code = false
    }
  }
}
</script>
