<template>
  <!--<v-layout row style="height: 100%;">-->
  <!--<v-flex xs6>-->
  <conversation :messages="messages" :propositions="propositions"></conversation>
  <!--</v-flex>-->
  <!--<v-flex xs6>-->
  <!--<profile></profile>-->
  <!--</v-flex>-->
  <!--</v-layout>-->
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
        messages: null,
        propositions: null,
        profile: null
      }
    },
    created () {
      this.refreshMatch(this.$route)
    },
    watch: {
      '$route' (to) {
        this.refreshMatch(to)
      }
    },
    methods: {
      async refreshMatch (route) {
        let matchId = route.params.matchId
        this.messages = (await axios.get(`http://localhost:8081/matches/${matchId}/messages`)).data
        this.propositions = (await axios.get(`http://localhost:8081/matches/${matchId}/propositions`)).data
        this.profile = (await axios.get(`http://localhost:8081/user/matches/${matchId}`)).data
      }
    }
  }
</script>
