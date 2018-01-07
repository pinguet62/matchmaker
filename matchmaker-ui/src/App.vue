<template>
  <div>
    <router-link to="/admin">Admin</router-link>
    <router-link to="/user">User</router-link>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
