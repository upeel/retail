<template lang="html">
  <v-dialog v-model="showDialog" persistent content-class="border-radius-10" max-width="350">
    <v-card class="p-relative">
      <v-btn icon class="btn-close-dialog" @click="closeDialog">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <div class="d-img-verificarion">
        <v-img v-if="typeOtp === 1" :src="require('@/assets/img/png/use_message.png')" height="192" width="290" contain class="mx-auto" />
        <v-img v-if="typeOtp === 2" :src="require('@/assets/img/png/use_call.png')" height="192" width="290" contain class="mx-auto" />
        <v-img v-if="typeOtp === 3" :src="require('@/assets/img/png/use_whatsapp.png')" height="192" width="290" contain class="mx-auto" />
      </div>
      <div class="pa-4">
        <div class="font-14 line-height-normal">
          <template v-if="typeOtp === 1">
            <i18n path="account.desc_otp_message" tag="span">
              <template #phone>
                <span class="primary--text font-weight-bold">{{ phone }}</span>
              </template>
            </i18n>
          </template>
          <template v-else-if="typeOtp === 2">
            <i18n path="account.desc_otp_miscall" tag="span">
              <template #phone>
                <span class="primary--text font-weight-bold">{{ phone }}</span>
              </template>
            </i18n>
          </template>
          <template v-else-if="typeOtp === 3">
            <i18n path="account.desc_otp_whatsapp" tag="span">
              <template #phone>
                <span class="primary--text font-weight-bold">{{ phone }}</span>
              </template>
            </i18n>
          </template>
        </div>
        <div class="wrap-input-code">
          <div v-if="typeOtp === 1">
            <div>
              <CodeInput ref="elCodeInput" :loading="false" :fields="5" :auto-focus="true" :field-width="40" :field-height="40" class="input inputVerificationCode" @change="onChangeOtp" @complete="onCompleteOtp" />
              <div v-if="hasError" class="code-has-error text-center">
                Code is invalid
              </div>
            </div>
          </div>
          <div v-else-if="typeOtp === 2" style="width: 100%;">
            <div class="d-flex align-center">
              <div class="text-wrap-call">
                +62 999 - 9999 -
              </div>
              <v-spacer />
              <CodeInput ref="elCodeInput" :loading="false" :fields="4" :auto-focus="true" :field-width="40" :field-height="40" class="input inputVerificationCode" @change="onChangeOtp" @complete="onCompleteOtp" />
            </div>
            <div v-if="hasError" class="code-has-error text-center">
              Code is invalid
            </div>
          </div>
          <div v-else-if="typeOtp === 3">
            <CodeInput ref="elCodeInput" :loading="false" :fields="6" :auto-focus="true" :field-width="40" :field-height="40" class="input inputVerificationCode" @change="onChangeOtp" @complete="onCompleteOtp" />
            <div v-if="hasError" class="code-has-error text-center">
              Code is invalid
            </div>
          </div>
        </div>
        <v-btn block color="primary" depressed :disabled="disabled" class="text-none border-radius-10 mb-4" @click="verify()">
          {{ $t('account.verification') }}
        </v-btn>
        <div>
          <div class="wrap-resend">
            <div v-if="typeOtp === 1" :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(1)">
              <div class="d-flex align-center">
                <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                  <path id="Icon_material-sms" data-name="Icon material-sms" d="M11,2H3a1,1,0,0,0-.995,1L2,12l2-2h7a1,1,0,0,0,1-1V3A1,1,0,0,0,11,2ZM5.5,6.5h-1v-1h1Zm2,0h-1v-1h1Zm2,0h-1v-1h1Z" transform="translate(3 3)" fill="#fff" />
                </svg>
                <div class="ml-2 primary--text font-weight-bold font-14">
                  {{ $t('account.resend_chat') }}
                </div>
              </div>
            </div>
            <div v-else-if="typeOtp === 2" :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(2)">
              <div class="d-flex align-center">
                <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                  <path id="Icon_ionic-ios-call" data-name="Icon ionic-ios-call" d="M14.647,12.4a10.079,10.079,0,0,0-2.105-1.409c-.631-.3-.862-.3-1.309.025-.372.269-.612.519-1.04.425A6.206,6.206,0,0,1,8.1,9.892,6.161,6.161,0,0,1,6.556,7.8c-.091-.431.159-.669.425-1.04.322-.447.331-.678.025-1.309A9.88,9.88,0,0,0,5.6,3.347c-.459-.459-.562-.359-.815-.269a4.64,4.64,0,0,0-.747.4,2.252,2.252,0,0,0-.9.947c-.178.384-.384,1.1.665,2.968a16.559,16.559,0,0,0,2.911,3.883h0l0,0,0,0h0A16.624,16.624,0,0,0,10.6,14.19c1.868,1.05,2.583.843,2.968.665a2.214,2.214,0,0,0,.947-.9,4.64,4.64,0,0,0,.4-.747C15.006,12.959,15.109,12.856,14.647,12.4Z" transform="translate(1.006 0.998)" fill="#fff" />
                </svg>
                <div class="ml-2 primary--text font-weight-bold font-14">
                  {{ $t("account.recall") }}
                </div>
              </div>
            </div>
            <div v-else-if="typeOtp === 3" :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(3)">
              <div class="d-flex align-center">
                <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#128c7e" />
                  <path id="Icon_ionic-logo-whatsapp" data-name="Icon ionic-logo-whatsapp" d="M7.609,1.5A5.868,5.868,0,0,0,1.718,7.345a5.785,5.785,0,0,0,.845,3.018L1.5,13.5l3.262-1.036A5.9,5.9,0,0,0,13.5,7.345,5.868,5.868,0,0,0,7.609,1.5Zm2.929,8.065a1.522,1.522,0,0,1-1.042.672c-.276.015-.284.214-1.79-.44A6.146,6.146,0,0,1,5.222,7.449a2.889,2.889,0,0,1-.556-1.566A1.669,1.669,0,0,1,5.24,4.658a.577.577,0,0,1,.408-.172c.119,0,.2,0,.283,0s.219-.018.333.285S6.651,5.82,6.686,5.9a.273.273,0,0,1,0,.262,1.023,1.023,0,0,1-.16.243c-.079.084-.165.189-.236.253s-.16.149-.078.3a4.508,4.508,0,0,0,.8,1.064A4.11,4.11,0,0,0,8.2,8.805c.148.08.236.072.327-.025s.392-.422.5-.567.205-.117.341-.062.861.443,1.009.524.246.121.282.185A1.237,1.237,0,0,1,10.538,9.565Z" transform="translate(2.5 2.5)" fill="#fff" />
                </svg>
                <div class="ml-2 whatsapp-resend font-weight-bold font-14">
                  {{ $t('account.resend_whatsapp') }}
                </div>
              </div>
            </div>
            <v-spacer />
            <div class="text-countdown">
              {{ formattedTimeLeft }}
            </div>
          </div>
          <div class="wrap-resend-without-bg">
            <template v-if="typeOtp === 1">
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(2)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                    <path id="Icon_ionic-ios-call" data-name="Icon ionic-ios-call" d="M14.647,12.4a10.079,10.079,0,0,0-2.105-1.409c-.631-.3-.862-.3-1.309.025-.372.269-.612.519-1.04.425A6.206,6.206,0,0,1,8.1,9.892,6.161,6.161,0,0,1,6.556,7.8c-.091-.431.159-.669.425-1.04.322-.447.331-.678.025-1.309A9.88,9.88,0,0,0,5.6,3.347c-.459-.459-.562-.359-.815-.269a4.64,4.64,0,0,0-.747.4,2.252,2.252,0,0,0-.9.947c-.178.384-.384,1.1.665,2.968a16.559,16.559,0,0,0,2.911,3.883h0l0,0,0,0h0A16.624,16.624,0,0,0,10.6,14.19c1.868,1.05,2.583.843,2.968.665a2.214,2.214,0,0,0,.947-.9,4.64,4.64,0,0,0,.4-.747C15.006,12.959,15.109,12.856,14.647,12.4Z" transform="translate(1.006 0.998)" fill="#fff" />
                  </svg>
                  <div class="ml-2 primary--text font-weight-bold font-14">
                    {{ $t("account.use_call") }}
                  </div>
                </div>
              </div>
              <v-spacer />
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(3)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#128c7e" />
                    <path id="Icon_ionic-logo-whatsapp" data-name="Icon ionic-logo-whatsapp" d="M7.609,1.5A5.868,5.868,0,0,0,1.718,7.345a5.785,5.785,0,0,0,.845,3.018L1.5,13.5l3.262-1.036A5.9,5.9,0,0,0,13.5,7.345,5.868,5.868,0,0,0,7.609,1.5Zm2.929,8.065a1.522,1.522,0,0,1-1.042.672c-.276.015-.284.214-1.79-.44A6.146,6.146,0,0,1,5.222,7.449a2.889,2.889,0,0,1-.556-1.566A1.669,1.669,0,0,1,5.24,4.658a.577.577,0,0,1,.408-.172c.119,0,.2,0,.283,0s.219-.018.333.285S6.651,5.82,6.686,5.9a.273.273,0,0,1,0,.262,1.023,1.023,0,0,1-.16.243c-.079.084-.165.189-.236.253s-.16.149-.078.3a4.508,4.508,0,0,0,.8,1.064A4.11,4.11,0,0,0,8.2,8.805c.148.08.236.072.327-.025s.392-.422.5-.567.205-.117.341-.062.861.443,1.009.524.246.121.282.185A1.237,1.237,0,0,1,10.538,9.565Z" transform="translate(2.5 2.5)" fill="#fff" />
                  </svg>
                  <div class="ml-2 whatsapp-resend font-weight-bold font-14">
                    {{ $t('account.use_whatsapp') }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="typeOtp === 2">
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(1)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                    <path id="Icon_material-sms" data-name="Icon material-sms" d="M11,2H3a1,1,0,0,0-.995,1L2,12l2-2h7a1,1,0,0,0,1-1V3A1,1,0,0,0,11,2ZM5.5,6.5h-1v-1h1Zm2,0h-1v-1h1Zm2,0h-1v-1h1Z" transform="translate(3 3)" fill="#fff" />
                  </svg>
                  <div class="ml-2 primary--text font-weight-bold font-14">
                    {{ $t('account.use_message') }}
                  </div>
                </div>
              </div>
              <v-spacer />
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(3)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#128c7e" />
                    <path id="Icon_ionic-logo-whatsapp" data-name="Icon ionic-logo-whatsapp" d="M7.609,1.5A5.868,5.868,0,0,0,1.718,7.345a5.785,5.785,0,0,0,.845,3.018L1.5,13.5l3.262-1.036A5.9,5.9,0,0,0,13.5,7.345,5.868,5.868,0,0,0,7.609,1.5Zm2.929,8.065a1.522,1.522,0,0,1-1.042.672c-.276.015-.284.214-1.79-.44A6.146,6.146,0,0,1,5.222,7.449a2.889,2.889,0,0,1-.556-1.566A1.669,1.669,0,0,1,5.24,4.658a.577.577,0,0,1,.408-.172c.119,0,.2,0,.283,0s.219-.018.333.285S6.651,5.82,6.686,5.9a.273.273,0,0,1,0,.262,1.023,1.023,0,0,1-.16.243c-.079.084-.165.189-.236.253s-.16.149-.078.3a4.508,4.508,0,0,0,.8,1.064A4.11,4.11,0,0,0,8.2,8.805c.148.08.236.072.327-.025s.392-.422.5-.567.205-.117.341-.062.861.443,1.009.524.246.121.282.185A1.237,1.237,0,0,1,10.538,9.565Z" transform="translate(2.5 2.5)" fill="#fff" />
                  </svg>
                  <div class="ml-2 whatsapp-resend font-weight-bold font-14">
                    {{ $t('account.use_whatsapp') }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="typeOtp === 3">
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(2)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                    <path id="Icon_ionic-ios-call" data-name="Icon ionic-ios-call" d="M14.647,12.4a10.079,10.079,0,0,0-2.105-1.409c-.631-.3-.862-.3-1.309.025-.372.269-.612.519-1.04.425A6.206,6.206,0,0,1,8.1,9.892,6.161,6.161,0,0,1,6.556,7.8c-.091-.431.159-.669.425-1.04.322-.447.331-.678.025-1.309A9.88,9.88,0,0,0,5.6,3.347c-.459-.459-.562-.359-.815-.269a4.64,4.64,0,0,0-.747.4,2.252,2.252,0,0,0-.9.947c-.178.384-.384,1.1.665,2.968a16.559,16.559,0,0,0,2.911,3.883h0l0,0,0,0h0A16.624,16.624,0,0,0,10.6,14.19c1.868,1.05,2.583.843,2.968.665a2.214,2.214,0,0,0,.947-.9,4.64,4.64,0,0,0,.4-.747C15.006,12.959,15.109,12.856,14.647,12.4Z" transform="translate(1.006 0.998)" fill="#fff" />
                  </svg>
                  <div class="ml-2 primary--text font-weight-bold font-14">
                    {{ $t('account.use_call') }}
                  </div>
                </div>
              </div>
              <v-spacer />
              <div :class="[`resend-code`, { 'disabled': formattedTimeLeft !== 'EXPIRED' }]" @click="resendCode(1)">
                <div class="d-flex align-center">
                  <svg id="Group_23308" data-name="Group 23308" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle id="Ellipse_620" data-name="Ellipse 620" cx="10" cy="10" r="10" fill="#1685c7" />
                    <path id="Icon_material-sms" data-name="Icon material-sms" d="M11,2H3a1,1,0,0,0-.995,1L2,12l2-2h7a1,1,0,0,0,1-1V3A1,1,0,0,0,11,2ZM5.5,6.5h-1v-1h1Zm2,0h-1v-1h1Zm2,0h-1v-1h1Z" transform="translate(3 3)" fill="#fff" />
                  </svg>
                  <div class="ml-2 primary--text font-weight-bold font-14">
                    {{ $t('account.use_message') }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      default: false,
      type: Boolean
    },
    phone: {
      default: '',
      type: String
    },
    typeOtp: {
      default: 3,
      type: Number
    },
    hasError: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: true,
      type: Boolean
    },
    expiryCode: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      timerInterval: null,
      time: 0
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    formattedTimeLeft() {
      let minutes = Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((this.time % (1000 * 60)) / 1000)
      let result
      if (this.time < 0) {
        result = 'EXPIRED'
      } else {
        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds
        result = minutes + ':' + seconds
      }
      return result
    }
  },
  watch: {
    value() {
      this.getExpiryTime(new Date(this.expiryCode))
    },
    expiryCode(newItem) {
      this.getExpiryTime(new Date(newItem))
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', false)
    },
    onChangeOtp(v) {
      this.$emit('change-input', v)
    },
    onCompleteOtp(v) {
      this.$emit('completed-input', v)
    },
    getExpiryTime(time) {
      clearInterval(this.timerInterval)
      const countDownDate = time.getTime()
      const _this = this
      this.timerInterval = setInterval(function() {
        const now = new Date().getTime()
        _this.time = countDownDate - now
        if (_this.time < 0) {
          clearInterval(_this.timerInterval)
        }
      }, 1000)
    },
    handleResetCodeInput() {
      const elCodeInput = this.$refs.elCodeInput
      if (elCodeInput) {
        elCodeInput.values = elCodeInput.values.flatMap(() => '')
      }
    },
    resendCode(type = 3) {
      if (this.formattedTimeLeft === 'EXPIRED') {
        if (type === 1) {
          this.$emit('resend-sms')
        } else if (type === 2) {
          this.$emit('resend-call')
        } else if (type === 3) {
          this.$emit('resend-wa')
        }
      }
    },
    verify() {
      this.$emit('verify')
    }
  }
}
</script>
