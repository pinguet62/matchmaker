<template>
  <provider-login-button :disabled="disabled"
                         providerTitle="Tinder"
                         icon="https://lh3.googleusercontent.com/stlBGKS482zWajOTk82IXFZhr22hk_NQewNOAJ0IeptPO73qfNesCyfNwW1-xwBiwv0=w300-rw"
                         :label="label"
                         @submit="$emit('submit', $event)"/>
</template>

<script>
  import ProviderLoginButton from './ProviderLoginButton'

  export default {
    name: 'TinderLoginButton',
    components: {ProviderLoginButton},
    props: {
      disabled: {
        type: Boolean
      },
      label: {
        type: String
      }
    }
  }
</script>
