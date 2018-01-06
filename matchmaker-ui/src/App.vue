<template>
  <div>
    <router-link to="/admin">Admin</router-link>
    <router-link to="/user">User</router-link>
    <router-view/>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'app',
    data () {
      return {
        navigationDrawerOpen: true,
        matches: []
      }
    },
    async created () {
      this.matches = (await axios.get('http://localhost:8081/matches')).data
    },
    methods: {
      onMatchSelected (match) {
        this.$router.push(match._id)
      }
    }
  }
</script>
