<template>
  <div>
    <login v-if="!$store.getters.isLogged"></login>
    <logged v-if="$store.getters.isLogged"></logged>
  </div>
</template>

<script>
  import Logged from './Logged'
  import Login from './Login'

  export default {
    components: {
      Login,
      Logged
    },
    name: 'Admin'
  }
</script>
