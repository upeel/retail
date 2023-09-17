import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function listShippingCost(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shippingtariffs', { params: new_params })
}

export function shippingCost(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shippingtariffs', { params: new_params })
}

export function freeShipping(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/delievery', { params: new_params })
}

export function shippingList(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/shipping/list', { params: new_params })
}
