<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer app clipped absolute v-model="navigationDrawerOpen">
        <v-list>
          <v-list-tile v-for="match in matches" @click="onMatchSelected(match)">{{match.person.name}}</v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar app absolute clipped-left>
        <v-toolbar-side-icon @click.stop="navigationDrawerOpen = !navigationDrawerOpen"/>
        <v-toolbar-title>Tinder</v-toolbar-title>
      </v-toolbar>

      <v-content style="height: 100vh;">
        <!--<v-container style="height: 100%;">-->
          <router-view/>
        <!--</v-container>-->
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import { matches } from './mocks'

  export default {
    name: 'app',
    data () {
      return {
        navigationDrawerOpen: true,
        matches: matches
      }
    },
    methods: {
      onMatchSelected (match) {
        this.$router.push(match._id)
      }
    }
  }
</script>
