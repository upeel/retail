import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from '@/lang/en'
import idLocale from '@/lang/id'
import id from 'vee-validate/dist/locale/id.json'
import en from 'vee-validate/dist/locale/en.json'
import Cookies from 'js-cookie'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const messages = {
    en: {
      ...enLocale
    },
    id: {
      ...idLocale
    }
  }
  const enCustomMessage = {
    point_maps: 'Pin your location',
    strong_password: 'The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)',
    phoneNumber: 'Phone number must be correctly',
    creditCard: 'Credit card must be correctly',
    creditCardCVN: 'CVN must be correctly'
  }
  const idCustomMessage = {
    point_maps: 'Pin lokasi anda terlebih dahulu',
    strong_password: 'Kata sandi harus menggunakan setidaknya: 1 huruf besar, 1 huruf kecil, 1 angka, dan satu karakter khusus (Contoh , . _ & ? )',
    phoneNumber: 'No. Hp harus diisi dengan benar',
    creditCard: 'Kartu kredit harus diisi dengan benar',
    creditCardCVN: 'CVN harus diisi dengan benar'
  }

  const validation = {
    en: {
      fields: {
        name: 'Name',
        email: 'Email',
        address: 'Address',
        country_id: 'Country',
        state_id: 'Province',
        city_id: 'City',
        subdistrict_id: 'Subdistrict',
        point_maps: 'Point maps',
        postal_code: 'Postal code',
        emailorphone: 'Email or Phone number',
        current_email: 'E-mail',
        current_password: 'Password',
        password: 'Password',
        phone: 'Phone number',
        current_phone: 'Phone number',
        note: 'Note',
        no_meja: 'No. Table',
        otp_type_email: 'Email',
        otp_type_phone: 'Phone',
        credit_card: 'Credit card',
        credit_card_cvn: 'CVV'
      },
      validation: Object.assign({}, en.messages, enCustomMessage)
    },
    id: {
      fields: {
        name: 'Nama',
        email: 'Email',
        address: 'Alamat',
        country_id: 'Negara',
        state_id: 'Provinsi',
        city_id: 'Kota',
        subdistrict_id: 'Kecamatan',
        point_maps: 'Point maps',
        postal_code: 'Kode pos',
        emailorphone: 'Email atau No. handphone',
        current_email: 'Email',
        current_password: 'Kata sandi',
        password: 'Kata sandi',
        phone: 'No. handphone',
        current_phone: 'No. handphone saat ini',
        note: 'Catatan',
        no_meja: 'Nomor meja',
        otp_type_email: 'Email',
        otp_type_phone: 'Phone',
        credit_card: 'Kartu kredit',
        credit_card_cvn: 'CVV'
      },
      validation: Object.assign({}, id.messages, idCustomMessage)
    }
  }

  const data = {}
  data.en = { ...validation.en, ...messages.en }
  data.id = { ...validation.id, ...messages.id }
  return data
}

export default new VueI18n({
  locale: Cookies.get(process.env.VUE_APP_COOKIE_KEY + '_Locale') || process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: Cookies.get(process.env.VUE_APP_COOKIE_KEY + '_Locale') || process.env.VUE_APP_I18N_LOCALE,
  messages: loadLocaleMessages()
})
