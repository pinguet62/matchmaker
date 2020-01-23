<template>
  <div>
    <div style="text-align: center;">
      <v-btn color="error" @click="logout">
        <v-icon left>exit_to_app</v-icon>
        Logout
      </v-btn>
    </div>

    <div>
      <provider-register/>

      <div style="display: flex; align-items: center;">
        <v-btn icon color="pink" dark @click="onCreateSharedLink()">
          <v-icon>add</v-icon>
        </v-btn>
        <v-select v-bind:items="sharedLinks" v-model="selectedSharedLink" item-text="link"
                  v-bind:error-messages="['Please select a value']"/>
        <v-btn icon color="black" dark @click="onDeleteSharedLink()" :disabled="!selectedSharedLink">
          <v-icon>delete</v-icon>
        </v-btn>
      </div>

      <div v-if="selectedSharedLink">
        <div style="display: flex; align-items: center;">
          <v-btn @click="copyToClipboard($refs.link)">
            <v-icon>content_copy</v-icon>
          </v-btn>
          <v-text-field ref="link" readonly :full-width="false" hide-details :value="selectedSharedLink.link" label="Code"/>
        </div>
        <div style="display: flex; align-items: center;">
          <v-btn @click="copyToClipboard($refs.url)">
            <v-icon>content_copy</v-icon>
          </v-btn>
          <v-text-field ref="url" readonly :full-width="false" hide-details :value="window.location.origin + '/#/user/' + selectedSharedLink.link" label="URL"/>
        </div>
      </div>

      <div v-if="selectedSharedLink">
        <div style="text-align: center;">
          <v-btn @click="onSaveSharedLinkMatches()" color="success">Save</v-btn>
        </div>

        <div>
          <v-list>
            <template v-for="match in matches">
              <v-list-tile :key="match.id" avatar>
                <v-list-tile-avatar>
                  <img v-bind:src="match.person.photo">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="match.person.name"/>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-switch v-model="selectedSharedLink.matchIds" :value="match.id" hide-details/>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider :key="match.id"/>
            </template>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProviderRegister from './ProviderRegister'

  export default {
    name: 'Logged',
    components: {ProviderRegister},
    data () {
      return {
        window: window,
        userId: this.$store.state.userId,
        sharedLinks: [],
        selectedSharedLink: null,
        matches: []
      }
    },
    created () {
      this.loadMatches() // await
      this.loadSharedLinks() // await
    },
    methods: {
      async logout () {
        this.$router.push('/')
        this.$store.state.userId = null
      },
      async loadMatches () {
        this.matches = (await axios.get(`${process.env.VUE_APP_API_URL}/matches`, {headers: {userId: this.userId}})).data
      },
      async loadSharedLinks () {
        this.sharedLinks = (await axios.get(`${process.env.VUE_APP_API_URL}/sharedLinks`, {headers: {userId: this.userId}})).data
      },
      async onCreateSharedLink () {
        let createdSharedLink = (await axios.post(`${process.env.VUE_APP_API_URL}/sharedLinks`, null, {headers: {userId: this.userId}})).data
        this.sharedLinks.push(createdSharedLink)
        this.selectedSharedLink = createdSharedLink
      },
      async onDeleteSharedLink () {
        let sharedLinkLink = this.selectedSharedLink.link
        await axios.delete(`${process.env.VUE_APP_API_URL}/sharedLinks/${sharedLinkLink}`, {headers: {userId: this.userId}})
        this.sharedLinks.splice(this.sharedLinks.findIndex(it => it.link === sharedLinkLink), 1)
        this.selectedSharedLink = null
      },
      async onSaveSharedLinkMatches () {
        await axios.put(`${process.env.VUE_APP_API_URL}/sharedLinks/${this.selectedSharedLink.link}`, this.selectedSharedLink.matchIds, {headers: {userId: this.userId}})
      },
      copyToClipboard (textFieldRef) {
        textFieldRef.$el.getElementsByTagName('input')[0].select()
        document.execCommand('Copy')
      }
    }
  }
</script>
