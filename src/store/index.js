import Vue from 'vue'
import Vuex from 'vuex'
import global from './modules/global'
import outlet from './modules/outlet'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    global,
    outlet
  }
})
