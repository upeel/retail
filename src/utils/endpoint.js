import { getLocale } from '@/utils/locale'

export function getBaseUrl() {
  var selectedlocale = getLocale()
  if (selectedlocale === undefined || selectedlocale == null) {
    selectedlocale = process.env.VUE_APP_I18N_LOCALE
  }
  const baseURL = '/' + selectedlocale
  return baseURL
}

export function getBaseUrlStore() {
  var selectedlocale = getLocale()
  if (selectedlocale === undefined || selectedlocale == null) {
    selectedlocale = process.env.VUE_APP_I18N_LOCALE
  }
  const url_domain = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_url_domain')
  const baseURL = '/' + selectedlocale + '/' + url_domain
  return baseURL
}

export function getParameter() {
  const parameter = {}
  return parameter
}
