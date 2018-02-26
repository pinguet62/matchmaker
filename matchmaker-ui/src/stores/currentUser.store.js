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
    async login ({commit, state}, {provider, secret}) {
      console.log('process.env', process.env)
      console.log('process.env.VUE_APP_API_URL', process.env.VUE_APP_API_URL)
      state.userId = (await axios.post(`${process.env.VUE_APP_API_URL}/login/${provider}`, {secret})).data
    }
  }
})
