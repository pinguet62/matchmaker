import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: null
  },
  getters: {
    isLogged: state => {
      return state.userId !== null
    }
  },
  actions: {
    async login ({commit, state}, tinderToken) {
      state.userId = (await axios.post(`${process.env.API_URL}/login`, {token: tinderToken})).data
    }
  }
})
