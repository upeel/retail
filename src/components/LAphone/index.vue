<template lang="html">
  <ValidationProvider v-slot="{ errors }" :name="nameValidation" :rules="{ required: true, phoneNumber: { countryCode }}">
    <div :class="[`v-input__control`, { 'shadow-input' : type === 'solo' }]">
      <div :class="[{ 'phone-error': errors[0], 'phone-number-input-wrapper' : type === 'outlined', 'phone-number-input-solo input-with-label' : type === 'solo' }]">
        <label v-if="label !== '' & type !== 'outlined'">
          {{ label }}
        </label>
        <div style="position: relative;">
          <vue-phone-number-input v-model="phone" :translations="translations" readonly default-country-code="ID" :preferred-countries="['ID', 'SG', 'MY']" color="#00CA96" no-example :class="[`mb-1`, { 'phone-has-appned': $slots.append }]" @update="onUpdatePhoneNumber" />
          <div v-if="$slots.append" class="phone-la-append">
            <div>
              <slot name="append" />
            </div>
          </div>
        </div>
      </div>
      <div class="v-text-field__details detail_custom">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">
              {{ errors[0] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
export default {
  name: 'LAPhoneNumber',
  components: {
    ValidationProvider
  },
  props: {
    value: {
      default: '',
      type: [Number, String]
    },
    label: {
      default: '',
      type: String
    },
    nameValidation: {
      default: 'phone',
      type: String
    },
    type: {
      default: 'outlined',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      dataPhone: {},
      countryCode: 'ID',
      translations: {
        countrySelectorLabel: '',
        countrySelectorError: '',
        phoneNumberLabel: this.type === 'solo' ? '' : this.label,
        example: ''
      }
    }
  },
  computed: {
    'phone': {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'dataPhone'(newItem, oldItem) {
      if (newItem.isValid === true) {
        this.phone = newItem.e164
      }
    }
  },
  methods: {
    onUpdatePhoneNumber(payload) {
      this.countryCode = payload.countryCode
      this.dataPhone = { ...payload }
    }
  }
}
</script>

<style lang="css">
.input-tel.has-value .input-tel__label{
  font-size: 10px !important;
  top: 2px !important;
  line-height: normal !important;
}
.phone-number-input-wrapper .country-selector__input{
  padding-top: 1px !important;
  font-size: 16px !important;
  padding-right: 0px !important;
}
.phone-number-input-wrapper .country-selector__toggle{
  display: none !important;
}
.phone-number-input-wrapper .country-selector__country-flag{
  top: 15px !important;
}
.phone-number-input-wrapper .select-country-container{
  flex: 0 0 80px !important;
  width: 80px !important;
  min-width: 80px !important;
  max-width: 80px !important;
}
.phone-number-input-wrapper .input-tel__input{
  padding-top: 1px!important;
  font-size: 16px !important;
}
.phone-error .input-tel__input, .phone-error .country-selector__input{
  border: solid 2px #ff5252 !important;
}
.phone-error .country-selector__input{
  border-right: 0px !important;
}
.v-text-field__details.detail_custom{
  padding: 0 12px;
  margin-bottom: 8px;
}
.input-tel.input-phone-number.is-valid > input, .country-selector.input-country-selector.is-valid > input{
  border-color: #1a73e8 !important;
  box-shadow: none !important;
}
.input-tel.input-phone-number.has-error > input, .country-selector.input-country-selector.has-error > input{
  border-color: #ff5252 !important;
  box-shadow: none !important;
  border: solid;
}
.input-tel.input-phone-number.is-focused > input, .country-selector.input-country-selector.is-focused > input{
  border: solid;
  box-shadow: none !important;
}
.shadow-input .phone-error .input-tel__input, .shadow-input .phone-error .country-selector__input{
  border: none !important;
}
.shadow-input .vue-phone-number-input .select-country-container{
  height: 100%;
  width: auto !important;
  min-width: unset !important;
  max-width: unset !important;
  flex: 0 0 !important;
}
.shadow-input .country-selector {
  display: flex !important;
  padding: 0px;
  align-items: center !important;
  height: 100% !important;
}
.shadow-input .country-selector__country-flag{
  position: relative !important;
  top: unset !important;
  left: unset !important;
  margin: auto 8px !important;
}
.shadow-input .country-selector__input{
  padding: 0px !important;
  width: 40px !important;
  height: unset !important;
  display: flex !important;
}
.shadow-input .country-selector__toggle{
  position: relative !important;
  top: unset !important;
  right: unset !important;
}
.shadow-input .country-selector__input, .shadow-input .input-tel__input{
  border: none !important;
}
.shadow-input .vue-phone-number-input {
  box-shadow: 0px 2px 2px #0000001A !important;
  border: solid 1px #EEEEEE !important;
  margin-bottom: 4px;
  height: 56px;
  align-items: center;
}
.shadow-input .input-tel.has-hint .input-tel__input, .shadow-input .input-tel.has-value .input-tel__input{
  padding-top: 0px !important;
}
.phone-la-append {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 2;
}
.phone-la-append > div {
  margin-right: 12px;
}
.phone-has-appned .input-tel.input-phone-number {
  width: calc(100% - 44px);
}
</style>
