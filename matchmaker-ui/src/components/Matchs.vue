<template>
  <div>
    <v-app>
      <v-navigation-drawer app clipped absolute v-model="navigationDrawerOpen">
        <v-list>
          <v-list-tile v-for="match in matches" :key="match._id" @click="onMatchSelected(match)">{{match.person.name}}</v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar app absolute clipped-left>
        <v-toolbar-side-icon @click.stop="navigationDrawerOpen = !navigationDrawerOpen"/>
        <v-toolbar-title>Tinder</v-toolbar-title>
      </v-toolbar>

      <v-content style="height: 100vh;">
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Matchs',
    data () {
      return {
        navigationDrawerOpen: true,
        matches: []
      }
    },
    async created () {
      this.matches = (await axios.get(`${process.env.API_URL}/matches`)).data
    },
    methods: {
      onMatchSelected (match) {
        this.$router.push(`/user/${match._id}`)
      }
    }
  }
</script>
