<template>
  <v-container>
    <v-layout justify-center>
      <v-flex lg3>
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text align="center">
            <v-btn @click="tinderLoginDialog = true">
              <v-avatar size="24px">
                <img class="icon" src="https://lh3.googleusercontent.com/stlBGKS482zWajOTk82IXFZhr22hk_NQewNOAJ0IeptPO73qfNesCyfNwW1-xwBiwv0=w300-rw">
              </v-avatar>
              Tinder
            </v-btn>
            <v-btn disabled>
              <v-avatar size="24px">
                <img class="icon" src="https://lh3.googleusercontent.com/ChCmJuIViKo210sbmQRORBrWa9E1YbjgKPbsJ-vxBn74ecufJ7OEnYnn2fnEA6RgPY4=w300-rw">
              </v-avatar>
              Happn
            </v-btn>
            <v-btn disabled>
              <v-avatar size="24px">
                <img class="icon" src="https://lh3.googleusercontent.com/epJw-VIvHwumTY73TUGTnwy1hSaWXmxCnQ_0x28_lXjWrcPj9Qv-Xu7YYJbbryfO5Q=w300">
              </v-avatar>
              Once
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="tinderLoginDialog" max-width="330px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Tinder</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field v-model="tinderToken" label="Token"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="tinderLogin" color="success">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Login',
    data () {
      return {
        tinderLoginDialog: false,
        tinderToken: null
      }
    },
    methods: {
      async tinderLogin () {
        this.tinderLoginDialog = false
        let userId = (await axios.post(`${process.env.API_URL}/login`, {token: this.tinderToken})).data
        this.tinderToken = null
        this.$emit('onUserId', userId)
      }
    }
  }
</script>
