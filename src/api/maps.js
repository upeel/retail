import { request } from '@/utils/request'
import { getBaseUrlStore, getParameter } from '@/utils/endpoint'

export function autoComplete(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/maps/placeautocomplete', data, { params: new_params })
}

export function geoCodeByLatLng(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/maps/geocodebylatlon', data, { params: new_params })
}

export function placeDetail(id, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.get(getBaseUrlStore() + '/maps/placedetails/' + id, { params: new_params })
}

export function distanceMatrix(data, params = {}) {
  const new_params = { ...getParameter(), ...params }
  return request.post(getBaseUrlStore() + '/maps/distancematrix', data, { params: new_params })
}
