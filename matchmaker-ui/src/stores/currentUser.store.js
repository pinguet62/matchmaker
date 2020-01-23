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
    login: async function ({state}, {provider, secret}) {
      state.userId = (await axios.post(`${process.env.VUE_APP_API_URL}/login/${provider}`, {secret})).data
    }
  }
})
