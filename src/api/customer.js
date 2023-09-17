import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function getCustomer(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/customer', { params: new_params })
}

export function createAddress(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/address', data, { params: new_params })
}

export function listAddress(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/customer/address', { params: new_params })
}

export function detailAddress(id, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/customer/address/' + id, { params: new_params })
}

export function delAddress(id, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.delete(getBaseUrlStore() + '/customer/address/' + id, { params: new_params })
}

export function updateAddress(id, data) {
  return request.put(getBaseUrlStore() + '/customer/address/' + id, data)
}

export function changeProfile(data, headers, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/update', data, { headers: headers }, { params: new_params })
}

export function checkPassword(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/checkpassword', data, { params: new_params })
}

export function changeEmail(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/changeemail', data, { params: new_params })
}

export function changePhone(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/changephone', data, { params: new_params })
}

export function checkOtp(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/updatephone', data, { params: new_params })
}

export function changePassword(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/changepassword', data, { params: new_params })
}

export function checkValidOtp(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/customer/validotp', data, { params: new_params })
}

export function changePass(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/customer/updatepassword', data, { params: new_params })
}
