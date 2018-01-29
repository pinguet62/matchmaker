<template>
  <div>
    <div style="text-align: center;">
      <v-btn color="error" @click="$router.push('/')">
        <v-icon left>exit_to_app</v-icon>
        Logout
      </v-btn>
    </div>

    <div>
      <div>
        <v-btn disabled>
          <v-avatar size="24px">
            <img class="icon" src="https://lh3.googleusercontent.com/stlBGKS482zWajOTk82IXFZhr22hk_NQewNOAJ0IeptPO73qfNesCyfNwW1-xwBiwv0=w300-rw">
          </v-avatar>
          Add Tinder account
        </v-btn>
        <v-btn disabled>
          <v-avatar size="24px">
            <img class="icon" src="https://lh3.googleusercontent.com/ChCmJuIViKo210sbmQRORBrWa9E1YbjgKPbsJ-vxBn74ecufJ7OEnYnn2fnEA6RgPY4=w300-rw">
          </v-avatar>
          Add Happn account
        </v-btn>
        <v-btn disabled>
          <v-avatar size="24px">
            <img class="icon" src="https://lh3.googleusercontent.com/epJw-VIvHwumTY73TUGTnwy1hSaWXmxCnQ_0x28_lXjWrcPj9Qv-Xu7YYJbbryfO5Q=w300">
          </v-avatar>
          Add Once account
        </v-btn>
      </div>

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
          <v-btn @click="copyToClipbord($refs.link)">
            <v-icon>content_copy</v-icon>
          </v-btn>
          <v-text-field ref="link" readonly :full-width="false" hide-details :value="selectedSharedLink.link" label="Code"/>
        </div>
        <div style="display: flex; align-items: center;">
          <v-btn @click="copyToClipbord($refs.url)">
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
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img v-bind:src="match.person.photos[0].url">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="match.person.name"/>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-switch v-model="selectedSharedLink.matchIds" :value="match._id" hide-details/>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider/>
            </template>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Logged',
    data () {
      return {
        window: window,
        userId: this.$store.state.userId,
        sharedLinks: [],
        selectedSharedLink: null,
        matches: []
      }
    },
    async created () {
      await this.loadMatches()
      await this.loadSharedLinks()
    },
    methods: {
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
      },
      copyToClipbord (textFieldRef) {
        textFieldRef.$el.getElementsByTagName('input')[0].select()
        document.execCommand('Copy')
      }
    }
  }
</script>
