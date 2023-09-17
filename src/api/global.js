import { request } from '@/utils/request'
import { getBaseUrl, getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function hintStore(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrl() + '/hintstore', data, { params: new_params })
}

export function listCountry(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shipping/getcountry', { params: new_params })
}

export function listState(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shipping/getstate', { params: new_params })
}

export function listCity(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shipping/getcity', { params: new_params })
}

export function listSubDistrict(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shipping/getsubdistrict', { params: new_params })
}
