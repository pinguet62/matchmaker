<template>
  <div v-if="status">
    <tinder-login-button :disabled="status.tinder === 'up_to_date'"
                         :label="formatProviderStatus('Tinder', status.tinder)"
                         @submit="registerProvider('tinder', $event)"/>
    <once-login-button :disabled="status.once === 'up_to_date'"
                       :label="formatProviderStatus('Once', status.once)"
                       @submit="registerProvider('once', $event)"/>
  </div>
</template>

<script>
  import axios from 'axios'
  import OnceLoginButton from './providers/OnceLoginButton'
  import ProviderLoginButton from './providers/ProviderLoginButton'
  import TinderLoginButton from './providers/TinderLoginButton'

  export default {
    name: 'ProviderRegister',
    components: {
      OnceLoginButton,
      TinderLoginButton,
      ProviderLoginButton
    },
    data () {
      return {
        status: null
      }
    },
    created () {
      this.checkStatus() // await
    },
    methods: {
      async checkStatus () {
        this.status = (await axios.get(`${process.env.API_URL}/login/status`, {headers: {userId: this.$store.state.userId}})).data
      },
      formatProviderStatus (provider, status) {
        switch (status) {
          case 'not_registered':
            return `Register ${provider} account`
          case 'expired':
            return `Refresh ${provider} credentials`
          case 'up_to_date':
            return `${provider} credentials up-to-date`
          default:
            throw new Error(`Unknown status ${status}`)
        }
      },
      async registerProvider (provider, secret) {
        await axios.put(`${process.env.API_URL}/login/${provider}`, {secret}, {headers: {userId: this.$store.state.userId}})
        await this.checkStatus()
      }
    }
  }
</script>
