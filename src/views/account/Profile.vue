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
                {{ $t('profile.change_account') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <div class="mt-8">
            <div class="d-flex justify-center align-center">
              <input v-if="uploadReady" ref="fileInputImage" type="file" accept="image/x-png,image/gif,image/jpeg" class="d-none" @change="onFileInputImageChange($event)">
              <div class="p-relative">
                <v-img height="100" width="100" max-height="100" max-width="100" :src="customer.photo_md" class="rounded-circle" />
                <v-btn color="primary" fab width="24" height="24" dark class="btn-edit-profile" @click="sheet.options = !sheet.options">
                  <v-icon size="16">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="input-with-label">
              <label>
                {{ $t('account.name') }}
              </label>
              <v-text-field v-model="customer.name" solo height="56" readonly class="shadow-input">
                <template v-slot:append>
                  <v-btn icon color="primary" width="40" height="40" @click="changeName">
                    <v-icon size="19">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
            <div v-if="!$isEmpty(customer.phone) || customer.phone !== ''" class="input-with-label">
              <label>
                {{ $t('account.phone_number') }}
              </label>
              <v-text-field v-model="customer.phone" solo height="56" readonly class="shadow-input">
                <template v-slot:append>
                  <v-btn icon color="primary" width="40" height="40" @click="changePhone">
                    <v-icon size="19">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
            <div v-if="!$isEmpty(customer.email) || customer.email !== ''" class="input-with-label">
              <label>
                {{ $t('account.email') }}
              </label>
              <v-text-field v-model="customer.email" solo height="56" readonly class="shadow-input">
                <template v-slot:append>
                  <v-btn icon color="primary" width="40" height="40" @click="changeMail">
                    <v-icon size="19">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
            <v-btn v-if="!$isEmpty(customer.email) || customer.email !== ''" block color="#F5F5F5" height="40" class="text-none font-weight-bold" @click="chooseVerifyPassword">
              {{ $t('account.change_password') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-bottom-sheet v-model="sheet.options" inset content-class="rounded-t-lg">
      <v-sheet class="rounded-t-lg">
        <div class="px-6 py-4 font-20 font-weight-bold">
          Edit Photo
        </div>
        <v-list>
          <v-list-item @click="chooseImage()">
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                {{ $t('profile.change_photo') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="showConfirmDel()">
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                {{ $t('profile.remove_current_photo') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="sheet.name" persistent :content-class="'sheet-full'">
      <v-sheet style="height: 100%">
        <div class="sheet-bar">
          <div class="sheet-bar-content">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-btn icon class="mr-2" @click="closeChangeName">
                      <v-icon>
                        mdi-arrow-left
                      </v-icon>
                    </v-btn>
                    <div class="font-18 font-weight-bold">
                      {{ $t('account.change_name') }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <v-container>
          <ValidationObserver ref="observerFrmName">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
                <div class="mt-2">
                  <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                    <div class="input-with-label">
                      <label>
                        {{ $t('account.name') }}
                      </label>
                      <v-text-field v-model="form_name.name" solo height="56" :error-messages="errors" class="shadow-input" />
                    </div>
                  </ValidationProvider>
                </div>
              </v-col>
            </v-row>
            <div class="__menu-bottom menu-full">
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
                <v-btn color="primary" block x-large class="text-none" @click="updateName">
                  {{ $t('account.save') }}
                </v-btn>
              </v-col>
            </div>
          </ValidationObserver>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="sheet.email" persistent :content-class="'sheet-full'">
      <v-sheet style="height: 100%">
        <div class="sheet-bar">
          <div class="sheet-bar-content">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-btn icon class="mr-2" @click="closeChangeEmail">
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
          </div>
        </div>
        <v-container>
          <ValidationObserver ref="observerFrmEmail">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
                <div class="mt-2">
                  <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                    <div class="input-with-label">
                      <label>
                        {{ $t('account.email') }}
                      </label>
                      <v-text-field v-model="form_email.new_email" solo height="56" :error-messages="errors" class="shadow-input" />
                    </div>
                  </ValidationProvider>
                </div>
              </v-col>
            </v-row>
            <div class="__menu-bottom menu-full">
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
                <v-btn color="primary" block x-large class="text-none" @click="updateEmail">
                  {{ $t('account.save') }}
                </v-btn>
              </v-col>
            </div>
          </ValidationObserver>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="sheet.phone" persistent :content-class="'sheet-full'">
      <v-sheet style="height: 100%">
        <div class="sheet-bar">
          <div class="sheet-bar-content">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-btn icon class="mr-2" @click="closeChangePhone">
                      <v-icon>
                        mdi-arrow-left
                      </v-icon>
                    </v-btn>
                    <div class="font-18 font-weight-bold">
                      {{ $t('account.change_phone_number') }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <v-container>
          <ValidationObserver ref="observerFrmPhone">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
                <div class="mt-2">
                  <l-a-phone-number v-model="form_phone.new_phone" :label="$t('account.new_phone_number')" type="solo" />
                </div>
              </v-col>
            </v-row>
            <div class="__menu-bottom menu-full">
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
                <v-btn color="primary" block x-large class="text-none" @click="openDialogVerify">
                  {{ $t('account.save') }}
                </v-btn>
              </v-col>
            </div>
          </ValidationObserver>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="dialog.checkPass" content-class="border-radius-10" max-width="350">
      <v-card class="p-relative">
        <v-card-title class="font-18 font-weight-bold px-4 pt-6 pb-4">
          {{ $t('account.verify_yourself') }}
        </v-card-title>
        <v-card-text class="px-4 pb-0">
          <div class="input-with-label">
            <label>
              {{ $t('account.password') }}
            </label>
            <v-text-field v-model="form.password" solo height="56" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :type="showPassword ? 'text' : 'password'" class="shadow-input" @click:append="() => (showPassword = !showPassword)" />
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn block color="primary" height="40" depressed class="text-none" @click="checkPass">
            {{ $t('account.verification') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <dialog-select-otp v-model="dialog.select_verification" :phone="form_phone.new_phone" @click-whatsapp="selectOtp()" @click-call="selectOtp(2)" />
    <dialog-input-otp
      ref="dialogPhoneOtpRef"
      v-model="dialog.input_verification"
      :phone="form_phone.new_phone"
      :expiry-code="expiry_code"
      :type-otp="form_phone.use_otp_type"
      :has-error="error_code"
      :disabled="disable_verify"
      @change-input="onChangeOtp"
      @completed-input="onCompleteOtp"
      @verify="verifyAccount"
      @resend-sms="selectOtp(1, 0)"
      @resend-call="selectOtp(2, 0)"
      @resend-wa="selectOtp(3, 0)"
    />
    <dialog-success v-model="dialog.verified" @next="next()" />
    <dialog-select-otp v-model="dialog.pass_select_verification" :phone="customer.phone" @click-whatsapp="selectOtpPass()" @click-call="selectOtpPass(2)" />
    <dialog-input-otp
      ref="dialogPassOtpRef"
      v-model="dialog.pass_input_verification"
      :phone="customer.phone"
      :expiry-code="pass_expiry_code"
      :type-otp="form_opt_pass.use_otp_type"
      :has-error="pass_error_code"
      :disabled="pass_disable_verify"
      @change-input="onChangeOtpPass"
      @completed-input="onCompleteOtpPass"
      @verify="verifyAccountPass"
      @resend-sms="selectOtpPass(1, 0)"
      @resend-call="selectOtpPass(2, 0)"
      @resend-wa="selectOtpPass(3, 0)"
    />
    <dialog-success v-model="dialog.pass_verified" @next="nextPass()" />
    <v-bottom-sheet v-model="sheet.pass" persistent :content-class="'sheet-full'">
      <v-sheet style="height: 100%">
        <div class="sheet-bar">
          <div class="sheet-bar-content">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-btn icon class="mr-2" @click="closeChangePass">
                      <v-icon>
                        mdi-arrow-left
                      </v-icon>
                    </v-btn>
                    <div class="font-18 font-weight-bold">
                      {{ $t('account.change_password') }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <v-container>
          <ValidationObserver ref="observerFrmEmail">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
                <div class="mt-2">
                  <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:8">
                    <div class="input-with-label">
                      <label>
                        {{ $t('account.password') }}
                      </label>
                      <v-text-field v-model="form_pass.new_password" solo height="56" :error-messages="errors" :append-icon="showPasswordPass ? 'mdi-eye-off' : 'mdi-eye'" :type="showPasswordPass ? 'text' : 'password'" class="shadow-input" @click:append="() => (showPasswordPass = !showPasswordPass)" />
                    </div>
                  </ValidationProvider>
                </div>
              </v-col>
            </v-row>
            <div class="__menu-bottom menu-full">
              <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0">
                <v-btn color="primary" block x-large class="text-none" @click="updatePass">
                  {{ $t('account.save') }}
                </v-btn>
              </v-col>
            </div>
          </ValidationObserver>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'
import LAPhoneNumber from '@/components/LAphone/index'
import DialogSelectOtp from '@/components/verification/DialogSelectOtp'
import DialogInputOtp from '@/components/verification/DialogInputOtp'
import DialogSuccess from '@/components/verification/DialogSuccess'
import { changeProfile, checkPassword, changeEmail, changePhone, checkOtp, changePassword, checkValidOtp, changePass } from '@/api/customer'
export default {
  components: {
    LAPhoneNumber,
    ValidationObserver,
    ValidationProvider,
    DialogSelectOtp,
    DialogInputOtp,
    DialogSuccess
  },
  data() {
    return {
      dialog: {
        checkPass: false,
        select_verification: false,
        input_verification: false,
        verified: false,
        pass_select_verification: false,
        pass_input_verification: false,
        pass_verified: false
      },
      sheet: {
        options: false,
        name: false,
        email: false,
        phone: false,
        pass: false
      },
      verification_type: 1,
      customer: {},
      uploadReady: true,
      showPassword: false,
      form: {
        password: ''
      },
      form_name: {
        name: ''
      },
      form_email: {
        new_email: '',
        password: ''
      },
      form_phone: {
        new_phone: '',
        password: '',
        use_otp_type: 3
      },
      form_otp: {
        otp_code: ''
      },
      disable_verify: true,
      error_code: false,
      expiry_code: null,
      form_opt_pass: {
        use_otp_type: 3
      },
      pass_disable_verify: true,
      pass_error_code: false,
      pass_expiry_code: null,
      form_pass: {
        otp_code: '',
        new_password: ''
      },
      showPasswordPass: false
    }
  },
  watch: {
    'dialog.checkPass': function(newItem) {
      if (!newItem) {
        this.form.password = ''
      }
    }
  },
  mounted() {
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      if (this.$store.state.global.customer && !this.$isEmpty(this.$store.state.global.customer)) {
        this.customer = this.$store.state.global.customer
        this.form_name.name = this.customer.name
        this.form_email.new_email = this.customer.email
      }
    },
    goBack() {
      this.$router.push({ name: 'account_detail' }).catch(() => {})
    },
    chooseImage() {
      this.sheet.options = false
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
    changeName() {
      this.sheet.name = true
      document.querySelector('html').style.overflowY = 'hidden'
      this.getDefaultData()
    },
    closeChangeName() {
      this.sheet.name = false
      document.querySelector('html').style.overflowY = 'scroll'
    },
    closeChangeEmail() {
      this.sheet.email = false
      document.querySelector('html').style.overflowY = 'scroll'
    },
    closeChangePhone() {
      this.sheet.phone = false
      this.form_phone.new_phone = ''
      this.form_phone.password = ''
      document.querySelector('html').style.overflowY = 'scroll'
    },
    changePhone() {
      if (!this.$isEmpty(this.customer.email) || this.customer.email !== '') {
        this.dialog.checkPass = true
        this.verification_type = 1
      } else {
        this.sheet.phone = true
        document.querySelector('html').style.overflowY = 'hidden'
      }
    },
    changeMail() {
      this.dialog.checkPass = true
      this.verification_type = 2
    },
    async updateName() {
      const isValid = await this.$refs.observerFrmName.validate()
      if (isValid) {
        try {
          const { data } = await changeProfile(this.form_name)
          this.$store.dispatch('save_user', data.data)
          this.getDefaultData()
          this.sheet.name = false
          document.querySelector('html').style.overflowY = 'scroll'
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async updateEmail() {
      const isValid = await this.$refs.observerFrmEmail.validate()
      if (isValid) {
        try {
          const { data } = await changeEmail(this.form_email)
          this.$store.dispatch('save_user', data.data)
          this.getDefaultData()
          this.sheet.email = false
          document.querySelector('html').style.overflowY = 'scroll'
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async openDialogVerify() {
      const isValid = await this.$refs.observerFrmPhone.validate()
      if (isValid && this.form_phone.new_phone !== this.customer.phone) {
        this.dialog.select_verification = true
      }
    },
    async selectOtp(use_otp_type = 3, is_resend = 1) {
      this.resetFormNewPhoneOtp()
      this.form_phone.use_otp_type = use_otp_type
      try {
        await changePhone(this.form_phone)
        if (is_resend) {
          this.dialog.select_verification = false
        }
        this.dialog.input_verification = true
        this.expiry_code = (new Date(new Date().getTime() + (2 * 60000))).toString()
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async checkPass() {
      try {
        await checkPassword(this.form)
        this.getDefaultData()
        this.dialog.checkPass = false
        this.form_email.password = this.form.password
        this.form_phone.password = this.form.password
        if (this.verification_type === 1) {
          this.sheet.phone = true
          document.querySelector('html').style.overflowY = 'hidden'
        } else if (this.verification_type === 2) {
          this.sheet.email = true
          document.querySelector('html').style.overflowY = 'hidden'
        }
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    onChangeOtp(v) {
      if (this.form_phone.use_otp_type === 1 && v.length !== 5) {
        this.disable_verify = true
      } else if (this.form_phone.use_otp_type === 2 && v.length !== 4) {
        this.disable_verify = true
      } else if (this.form_phone.use_otp_type === 3 && v.length !== 6) {
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
        const { data } = await checkOtp(this.form_otp)
        this.$store.dispatch('save_user', data.data)
        this.getDefaultData()
        this.dialog.input_verification = false
        this.dialog.verified = true
        this.form_phone.new_phone = ''
        this.form_phone.password = ''
        this.resetFormNewPhoneOtp()
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
      this.getDefaultData()
      this.sheet.phone = false
      document.querySelector('html').style.overflowY = 'scroll'
    },
    chooseVerifyPassword() {
      this.dialog.pass_select_verification = true
    },
    async selectOtpPass(use_otp_type = 3, is_resend = 1) {
      this.resetFormPassOtp()
      this.form_opt_pass.use_otp_type = use_otp_type
      try {
        const res = await changePassword(this.form_opt_pass)
        if (is_resend) {
          this.dialog.pass_select_verification = false
        }
        this.dialog.pass_input_verification = true
        this.pass_expiry_code = res.data.data.detail.expiry_date_ext
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    onChangeOtpPass(v) {
      if (this.form_opt_pass.use_otp_type === 1 && v.length !== 5) {
        this.pass_disable_verify = true
      } else if (this.form_opt_pass.use_otp_type === 2 && v.length !== 4) {
        this.pass_disable_verify = true
      } else if (this.form_opt_pass.use_otp_type === 3 && v.length !== 6) {
        this.pass_disable_verify = true
      } else {
        this.pass_disable_verify = false
      }
      this.pass_error_code = false
    },
    onCompleteOtpPass(v) {
      this.form_pass.otp_code = v
    },
    async verifyAccountPass() {
      try {
        await checkValidOtp(this.form_pass)
        this.dialog.pass_input_verification = false
        this.dialog.pass_verified = true
        this.resetFormPassOtp()
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    nextPass() {
      this.dialog.pass_verified = false
      this.sheet.pass = true
      document.querySelector('html').style.overflowY = 'hidden'
    },
    closeChangePass() {
      this.sheet.pass = false
      document.querySelector('html').style.overflowY = 'scroll'
    },
    async updatePass() {
      try {
        const { data } = await changePass(this.form_pass)
        this.$store.dispatch('save_user', data.data)
        this.getDefaultData()
        this.sheet.pass = false
        document.querySelector('html').style.overflowY = 'scroll'
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    resetFormNewPhoneOtp() {
      this.$refs.dialogPhoneOtpRef.handleResetCodeInput()
      if (this.disable_verify === false) {
        this.disable_verify = true
      }
      this.error_code = false
    },
    resetFormPassOtp() {
      this.$refs.dialogPassOtpRef.handleResetCodeInput()
      if (this.pass_disable_verify === false) {
        this.pass_disable_verify = true
      }
      this.pass_error_code = false
    }
  }
}
</script>
