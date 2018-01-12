<template>
  <v-layout row fill-height>
    <v-flex xs6>
      <conversation :messages="messages" :propositions="propositions"
                    @newProposition="onNewProposition($event)" @deleteProposition="onDeleteProposition($event)"
                    @upProposition="onUpProposition($event)" @downProposition="onDownProposition($event)"/>
    </v-flex>
    <v-flex xs6>
      <profile v-if="profile" v-model="profile"/>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import Conversation from './Conversation'
  import Profile from './Profile'

  export default {
    name: 'Match',
    components: {
      Profile,
      Conversation
    },
    data () {
      return {
        sharedLinkLink: null,
        matchId: null,
        messages: [],
        propositions: [],
        profile: null
      }
    },
    created () {
      this.sharedLinkLink = this.$route.params.sharedLinkLink
      this.refreshMatch(this.$route)
    },
    watch: {
      '$route' (to) {
        this.refreshMatch(to)
      }
    },
    methods: {
      async refreshMatch (route) {
        this.matchId = route.params.matchId
        this.messages = (await axios.get(`${process.env.API_URL}/${this.sharedLinkLink}/matches/${this.matchId}/messages`)).data
        this.propositions = (await axios.get(`${process.env.API_URL}/matches/${this.matchId}/propositions`)).data
        this.profile = (await axios.get(`${process.env.API_URL}/${this.sharedLinkLink}/user/${this.matchId}`)).data
      },
      async onNewProposition (proposition) {
        let createdProposition = (await axios.post(`${process.env.API_URL}/matches/${this.matchId}/propositions`, proposition)).data
        this.propositions.push(createdProposition)
      },
      async onDeleteProposition (proposition) {
        let propositionId = proposition.id
        await axios.delete(`${process.env.API_URL}/matches/${this.matchId}/propositions/${propositionId}`)
        this.propositions.splice(this.propositions.findIndex(it => it.id === propositionId), 1)
      },
      async onUpProposition (proposition) {
        let updatedProposition = (await axios.put(`${process.env.API_URL}/matches/${this.matchId}/propositions/${proposition.id}/up`)).data
        proposition.up = updatedProposition.up
      },
      async onDownProposition (proposition) {
        let updatedProposition = (await axios.put(`${process.env.API_URL}/matches/${this.matchId}/propositions/${proposition.id}/down`)).data
        proposition.down = updatedProposition.down
      }
    }
  }
</script>
