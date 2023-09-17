import { store } from '@/store'

const MaskMoneyNoCurrency = {}
function parseString(el, binding) {
  const s = parseFloat(binding.value)
  const currId = store.getters.selected_store && store.getters.selected_store[0].store_more_currency[0].symbol ? store.getters.selected_store[0].store_more_currency[0].symbol : 'Rp'
  const precision = currId === 'Rp' ? 0 : 2
  const decimal = currId === 'Rp' ? ',' : '.'
  const thousands = currId === 'Rp' ? '.' : ','
  if (s) {
    const val = (s / 1).toFixed(precision).replace('.', decimal)
    el.innerHTML = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands)
  } else {
    el.innerHTML = 0
  }
}
MaskMoneyNoCurrency.install = Vue => {
  Vue.directive('MaskMoneyNoCurrency', {
    bind: (el, binding) => {
      parseString(el, binding)
    },

    update: (el, binding) => {
      parseString(el, binding)
    }
  })
}

export default MaskMoneyNoCurrency
