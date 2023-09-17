import Vue from 'vue'
import { ValidationProvider, extend, configure } from 'vee-validate'
import i18n from './i18n'
import { required, email, min, required_if } from 'vee-validate/dist/rules'
import libphonenumber from 'google-libphonenumber'

configure({
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`)
    return i18n.t(`validation.${values._rule_}`, values)
  }
})

const phoneNumber = {
  params: ['countryCode'],
  validate(value, { countryCode }) {
    return new Promise(resolve => {
      try {
        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
        const phone = phoneUtil.parse(value, countryCode)
        resolve({ valid: phoneUtil.isValidNumberForRegion(phone, countryCode) })
      } catch (e) {
        return false
      }
    })
  }
}

const creditCard = {
  validate(value) {
    return new Promise(resolve => {
      value = value.replace(/\s+/g, '')
      const credit_card = window.Xendit.card.validateCardNumber(value)
      resolve({ valid: credit_card })
    })
  }
}

const creditCardCVN = {
  validate(value) {
    return new Promise(resolve => {
      const credit_card_cvn = window.Xendit.card.validateCvn(value)
      resolve({ valid: credit_card_cvn })
    })
  }
}

extend('required', required)

extend('email', email)

extend('min', min)

extend('required_if', required_if)

extend('phoneNumber', phoneNumber)

extend('creditCard', creditCard)

extend('creditCardCVN', creditCardCVN)

extend('point_maps', value => {
  return value[0] !== 0 && value[1] !== 0
})

extend('strong_password', {
  validate: value => {
    var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    return strongRegex.test(value)
  }
})

Vue.component('ValidationProvider', ValidationProvider)
