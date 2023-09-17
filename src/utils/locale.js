import Cookies from 'js-cookie'

const LocaleKey = process.env.VUE_APP_COOKIE_KEY + '_Locale'

export function getLocale() {
  return Cookies.get(LocaleKey)
}

export function setLocale(locale) {
  return Cookies.set(LocaleKey, locale, { expires: 1 })
}

export function removeLocale() {
  return Cookies.remove(LocaleKey)
}
