<template>
  <div>
    <login v-if="!userId" @onUserId="userId = $event"></login>
    <logged v-if="userId" :userId="userId"></logged>
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
    name: 'Admin',
    data () {
      return {
        userId: null
      }
    }
  }
</script>
