<template>
  <div>
    <v-app>
      <v-content>
        <v-btn @click.native.stop="tinderLoginDialog = true">Tinder</v-btn>
        <v-dialog v-model="tinderLoginDialog" max-width="330px">
          <v-card>
            <v-card-title>Tinder</v-card-title>
            <v-card-text>
              <v-text-field v-model="tinderToken" label="Token"></v-text-field>
              <v-btn @click.native.stop="tinderLogin">Login</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>

        <div style="display: flex; align-items: center;">
          <v-btn icon @click="onCreateSharedLink()">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn icon @click="onDeleteSharedLink()" :disabled="!selectedSharedLink">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-select v-bind:items="sharedLinks" v-model="selectedSharedLink" item-text="link"></v-select>
        </div>

        <div v-if="selectedSharedLink">
          <v-btn @click="onSaveSharedLinkMatches()">Save</v-btn>
          <v-checkbox v-for="match in matches" :key="match._id"
                      v-model="selectedSharedLink.matchIds" :value="match._id"
                      :label="match.person.name"></v-checkbox>
        </div>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Admin',
    data () {
      return {
        userId: null,
        tinderLoginDialog: false,
        tinderToken: '',
        sharedLinks: [],
        selectedSharedLink: null,
        matches: []
      }
    },
    methods: {
      async tinderLogin () {
        this.tinderLoginDialog = false
        let userId = (await axios.post(`${process.env.API_URL}/login`, {token: this.tinderToken})).data
        this.userId = userId
        this.tinderToken = null

        await this.loadMatches()
        await this.loadSharedLinks()
      },
      async loadMatches () {
        this.matches = (await axios.get(`${process.env.API_URL}/matches`, {headers: {userId: this.userId}})).data
      },
      async loadSharedLinks () {
        this.sharedLinks = (await axios.get(`${process.env.API_URL}/sharedLinks`, {headers: {userId: this.userId}})).data
      },
      async onCreateSharedLink () {
        let createdSharedLink = (await axios.post(`${process.env.API_URL}/sharedLinks`, null, {headers: {userId: this.userId}})).data
        this.sharedLinks.push(createdSharedLink)
        this.selectedSharedLink = createdSharedLink
      },
      async onDeleteSharedLink () {
        let sharedLinkLink = this.selectedSharedLink.link
        await axios.delete(`${process.env.API_URL}/sharedLinks/${sharedLinkLink}`, {headers: {userId: this.userId}})
        this.sharedLinks.splice(this.sharedLinks.findIndex(it => it.link === sharedLinkLink), 1)
        this.selectedSharedLink = null
      },
      async onSaveSharedLinkMatches () {
        await axios.put(`${process.env.API_URL}/sharedLinks/${this.selectedSharedLink.link}`, this.selectedSharedLink.matchIds, {headers: {userId: this.userId}})
      }
    }
  }
</script>

<style scoped>
</style>
