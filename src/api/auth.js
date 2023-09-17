import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function systemLogin(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/system/login', { params: new_params })
}

export function loginAccount(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/login', data, { params: new_params })
}

export function preregister(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/pre-register', data, { params: new_params })
}

export function register(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/registerv2', data, { params: new_params })
}

export function verification(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/verification', data, { params: new_params })
}

export function resendOtp(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/otp-resend', data, { params: new_params })
}

export function logoutUser(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/customer/auth/logout', { params: new_params })
}

export function forgotPassword(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/forgotpassword', data, { params: new_params })
}

export function forgCheckValidOtp(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/auth/validotp', data, { params: new_params })
}

export function changePassword(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/auth/forgotpassword/changepassword', data, { params: new_params })
}
