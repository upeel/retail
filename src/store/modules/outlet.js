const domain = require('getdomain')
import { getOutlet } from '@/api/outlet'
import { hintStore } from '@/api/global'

const outlet = {
  state: {
    selected_outlet: {},
    url_domain: '',
    store_id: ''
  },

  mutations: {
    SET_OUTLET: (state, val) => {
      state.selected_outlet = val
    },
    SET_URL_DOMAIN(state, data) {
      state.url_domain = data
      localStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_url_domain', data)
    },
    SET_STORE_ID(state, data) {
      state.store_id = data
      localStorage.setItem(process.env.VUE_APP_COOKIE_KEY + '_store_id', data)
    }
  },

  getters: {
    selectedOutlet: state => state.selected_outlet
  },

  actions: {
    async checkDomain({ commit, state }) {
      const url_domain = localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_url_domain')
      if (url_domain === undefined || url_domain === '' || !url_domain) {
        if (process.env.NODE_ENV === 'development') {
          commit('SET_URL_DOMAIN', 'equinoc')
          commit('SET_STORE_ID', Number(95624))
        } else {
          const curr_domain = domain.get(window.location.href)
          if (curr_domain !== 'indociti.com') {
            var hostname = domain.hostname(window.location.href)
            if (hostname === 'localhost') {
              hostname = 'equinoc.antarinbarang.com'
            }
            const form = {
              domain: hostname
            }
            try {
              const { data } = await hintStore(form)
              commit('SET_URL_DOMAIN', data.data.url_id)
              commit('SET_STORE_ID', data.data.store_id)
            } catch (e) {
              commit('SET_URL_DOMAIN', '')
              commit('SET_STORE_ID', '')
            }
          } else if (curr_domain === 'indociti.com') {
            const hostname = 'equinoc.antarinbarang.com'
            const form = {
              domain: hostname
            }
            try {
              const { data } = await hintStore(form)
              commit('SET_URL_DOMAIN', data.data.url_id)
              commit('SET_STORE_ID', data.data.store_id)
            } catch (e) {
              commit('SET_URL_DOMAIN', '')
              commit('SET_STORE_ID', '')
            }
          } else {
            var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false
            commit('SET_URL_DOMAIN', subdomain)
          }
        }
      }
    },
    async fetchOutlet({ commit, state }, val) {
      try {
        const { data } = await getOutlet(val)
        commit('SET_OUTLET', data.data)
      } catch (e) {
        commit('SET_OUTLET', {})
      }
    }
  }
}

export default outlet
