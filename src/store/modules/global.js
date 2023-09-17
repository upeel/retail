import addSeconds from 'date-fns/addSeconds'
import { systemLogin } from '@/api/auth'
import { setToken, removeToken } from '@/utils/auth'

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

const global = {
  state: {
    data_cart: JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')),
    order_data: JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order')),
    customer: {},
    alert: {
      type: 'error',
      show: false,
      message: '',
      status_code: 500
    },
    loading: false,
    auth_data: JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_auth_data'))
  },

  mutations: {
    SET_DATA_CART: (state, data) => {
      state.data_cart = data
    },
    SET_DATA_ORDER: (state, data) => {
      state.order_data = data
    },
    SET_DATA_CUSTOMER: (state, data) => {
      state.customer = data
    },
    SET_ALERT: (state, val) => {
      state.alert = val
    },
    SET_LOADING: (state, val) => {
      state.loading = val
    },
    SET_TOKEN: async(state, val) => {
      if (!isEmpty(val)) {
        const tokensExpiry = await addSeconds(new Date(), val.expires_in)
        val.expires_time = tokensExpiry
        state.auth_data = val

        await setToken(val.access_token)
        delete val.access_token
        localStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_auth_data', JSON.stringify(val))
      } else {
        state.auth_data = {}
        await removeToken()
        localStorage.removeItem(process.env.VUE_APP_COOKIE_KEY + '_auth_data')
      }
    }
  },

  getters: {
    dataCart: state => state.data_cart,
    dataOrder: state => state.data_order,
    customer: state => state.customer,
    alert: state => state.alert,
    authData: state => state.auth_data,
    loading: state => state.loading
  },

  actions: {
    saveDataCart({ commit }, data) {
      commit('SET_DATA_CART', data)
      localStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart', JSON.stringify(data))
    },
    remove_cart({ commit }) {
      commit('SET_DATA_CART', {})
      localStorage.removeItem(process.env.VUE_APP_COOKIE_KEY + '_data_cart')
    },
    saveDataOrder({ commit }, data) {
      commit('SET_DATA_ORDER', data)
      localStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_order', JSON.stringify(data))
    },
    remove_order({ commit }) {
      commit('SET_DATA_ORDER', {})
      localStorage.removeItem(process.env.VUE_APP_COOKIE_KEY + '_order')
    },
    save_user({ commit }, data) {
      commit('SET_DATA_CUSTOMER', data)
    },
    showAlert({ commit }, data) {
      commit('SET_ALERT', data)
    },
    showLoading({ commit }, data) {
      commit('SET_LOADING', data)
    },
    async fetchToken({ commit, state }) {
      try {
        const { data } = await systemLogin()
        commit('SET_TOKEN', data)
      } catch (e) {
        commit('SET_TOKEN', {})
      }
    },
    save_token({ commit }, data) {
      if (!isEmpty(data)) {
        commit('SET_TOKEN', data)
      } else {
        commit('SET_TOKEN', {})
      }
    },
    remove_token({ commit }) {
      commit('SET_TOKEN', {})
    }
  }
}

export default global
