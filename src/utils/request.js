import axios from 'axios'
import { store } from '@/store'
import { getToken } from '@/utils/auth'
import subtractMinutes from 'date-fns/subMinutes'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL, // api
  timeout: 20000 // request timeout
})
request.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  store.dispatch('showLoading', true)
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  store.dispatch('showLoading', false)
  return response
}, async(error) => {
  store.dispatch('showLoading', false)
  let statusCode = 500
  let message = 'Connection timeout, please check your internet connection'
  let string = 'Connection timeout, please check your internet connection'

  const errorError = error.response.data.error.error
  let errArr = errorError
  string = errArr
  if (typeof errorError !== 'string') {
    string = ''
    errArr = Object.values(errorError)
    for (let index = 0; index < errArr.length; index++) {
      string += '- ' + errArr[index]
    }
  }
  const data = error.response.data.error.data

  const error_tagging = error.response.data.error.error_tagging
  statusCode = error.response.data.error.status_code
  message = error.response.data.error.message

  var tokenExpiryDate = null
  var tenMinutesBeforeExpiry = 0
  var now = Date.now()
  if (typeof store.state.global.auth_data.expires_time !== 'undefined') {
    tokenExpiryDate = Date.parse(store.state.global.auth_data.expires_time)
    tenMinutesBeforeExpiry = Date.parse(subtractMinutes(tokenExpiryDate, 30))
  }

  if (statusCode === 401) {
    if (!tokenExpiryDate || now > tenMinutesBeforeExpiry) {
      console.log(error.response, store.state.global.auth_data, now, tenMinutesBeforeExpiry, now > tenMinutesBeforeExpiry, 'token expiry')
      //   if (store.state.global.auth_data !== null) {
      //     if (store.state.global.auth_data.auth_by === 'BASIC' || store.state.global.auth_data.auth_by === 'SYSTEM') {
      //       console.log('1')
      //       await store.dispatch('fetchToken')
      //       location.reload()
      //     } else {
      //       console.log('2')
      //       await store.dispatch('fetchToken')
      //     }
      //   } else {
      //     console.log('3')
      //     await store.dispatch('fetchToken')
      //     location.reload()
      //   }
    }
  }
  return Promise.reject({
    statusCode,
    message,
    string,
    data,
    error_tagging
  })
})

export { request }
