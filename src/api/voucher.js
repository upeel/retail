import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function listVoucher(params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/discount', { params: new_params })
}
