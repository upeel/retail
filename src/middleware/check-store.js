import { store } from '@/store/index'

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

export default async() => {
  if (store.getters.selectedOutlet === undefined || !store.getters.selectedOutlet || isEmpty(store.getters.selectedOutlet)) {
    const selected_outlet = store.state.outlet.selected_outlet
    const store_id = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_store_id')
    if (selected_outlet === null || selected_outlet === undefined || isEmpty(selected_outlet)) {
      await store.dispatch('fetchOutlet', store_id)
    }
  }
}
