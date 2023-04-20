import Vue from 'vue'
import Vuex from 'vuex'
import checkout from './modules/Checkout'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    saveItem
  },
  modules: {
    checkout
  }
})
