import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function listPayment(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/paymentmodes/paymentchanel', { params: new_params })
}

