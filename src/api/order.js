import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function orders(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/selfsalesorder', { params: new_params })
}

export function order(id, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/selfsalesorder/' + id, { params: new_params })
}

export function orderCalculation(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/openorder/calculation', data, { params: new_params })
}

export function createOrder(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/openorder', data, { params: new_params })
}

export function cancelOrder(id, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.put(getBaseUrlStore() + '/openorder/cancelledorder/' + id, { params: new_params })
}
