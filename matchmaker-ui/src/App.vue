<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
  import currentUser from './stores/currentUser.store'

  export default {
    name: 'app',
    store: currentUser
  }
</script>
