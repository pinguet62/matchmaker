<template>
  <div>
    <v-navigation-drawer app clipped absolute v-model="navigationDrawerOpen">
      <v-list>
        <template v-for="match in matches">
          <v-list-tile avatar :to="'/user/' + $route.params.sharedLinkLink + '/' + match.id">
            <v-list-tile-avatar>
              <img v-bind:src="match.person.photo">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="match.person.name"/>
              <v-list-tile-sub-title v-if="match.lastMessage" v-html="match.lastMessage.text"/>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon small v-if="match.lastMessage && match.lastMessage.sent">reply</v-icon>
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
    name: 'Matches',
    data () {
      return {
        navigationDrawerOpen: true,
        matches: []
      }
    },
    async created () {
      this.matches = (await axios.get(`${process.env.VUE_APP_API_URL}/${this.$route.params.sharedLinkLink}/matches`)).data
    }
  }
</script>
