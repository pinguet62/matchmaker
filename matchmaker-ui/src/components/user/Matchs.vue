<template>
  <div>
    <v-navigation-drawer app clipped absolute v-model="navigationDrawerOpen">
      <v-list>
        <template v-for="match in matches">
          <v-list-tile avatar :to="'/user/' + $route.params.sharedLinkLink + '/' + match._id">
            <v-list-tile-avatar>
              <img v-bind:src="match.person.photos[0].url">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="match.person.name"/>
              <v-list-tile-sub-title v-html="match.messages[0] ? match.messages[0].message : ''"/>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon small v-if="match.messages[0] && match.messages[0].from === '52b4d9ed6c5685412c0002a1'">reply</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider/>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app absolute clipped-left>
      <v-toolbar-side-icon @click.stop="navigationDrawerOpen = !navigationDrawerOpen"/>
      <v-toolbar-title>Tinder</v-toolbar-title>
    </v-toolbar>

    <v-content style="height: 100vh;">
      <router-view/>
    </v-content>
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
      this.matches = (await axios.get(`${process.env.API_URL}/${this.$route.params.sharedLinkLink}/matches`)).data
    }
  }
</script>
