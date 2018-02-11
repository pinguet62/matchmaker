<template>
  <div>
    <v-btn :disabled="disabled" @click="showDialog = true">
      <v-avatar size="24px">
        <img class="icon" :src="icon">
      </v-avatar>
      {{label}}
    </v-btn>

    <v-dialog v-model="showDialog" max-width="335px">
      <v-card>
        <v-form>
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{providerTitle}}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="secret" label="Secret" autofocus/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn type="submit" @click="submit" color="success">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ProviderLoginButton',
    props: {
      disabled: {
        type: Boolean
      },
      providerTitle: {
        required: true,
        type: String
      },
      icon: {
        required: true,
        type: String
      },
      label: {
        type: String
      }
    },
    data () {
      return {
        showDialog: false,
        secret: null
      }
    },
    methods: {
      submit () {
        this.$emit('submit', this.secret)
        this.showDialog = false
        this.secret = null
      }
    }
  }
</script>
