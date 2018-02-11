<template>
  <provider-login-button :disabled="disabled"
                         providerTitle="Once"
                         icon="https://lh3.googleusercontent.com/epJw-VIvHwumTY73TUGTnwy1hSaWXmxCnQ_0x28_lXjWrcPj9Qv-Xu7YYJbbryfO5Q=w300"
                         :label="label"
                         @submit="$emit('submit', $event)"/>
</template>

<script>
  import ProviderLoginButton from './ProviderLoginButton'

  export default {
    name: 'OnceLoginButton',
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
