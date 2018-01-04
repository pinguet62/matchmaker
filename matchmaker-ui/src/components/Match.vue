<template>
  <!--<v-layout row style="height: 100%;">-->
    <!--<v-flex xs6>-->
      <conversation :messages="messages"></conversation>
    <!--</v-flex>-->
    <!--<v-flex xs6>-->
      <!--<profile></profile>-->
    <!--</v-flex>-->
  <!--</v-layout>-->
</template>

<script>
  import { messages } from '../mocks'
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
        messages: null
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
      refreshMatch (route) {
        let matchId = route.params.matchId
        this.messages = messages[matchId]
      }
    }
  }
</script>
