<template>
  <v-container>
    <v-layout justify-center>
      <v-flex lg2>
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text align="center">
            <tinder-login-button label="Login with Tinder" @submit="login('tinder', $event)"/>
            <once-login-button label="Login with Once" @submit="login('once', $event)"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import OnceLoginButton from './providers/OnceLoginButton'
  import TinderLoginButton from './providers/TinderLoginButton'

  export default {
    name: 'Login',
    components: {
      OnceLoginButton,
      TinderLoginButton
    },
    methods: {
      async login (provider, secret) {
        await this.$store.dispatch('login', {provider, secret})
      }
    }
  }
</script>
