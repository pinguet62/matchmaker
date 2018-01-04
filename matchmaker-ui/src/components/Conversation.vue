<template>
  <div class="conversation">
    <messages v-model="messages" class="messages"/>
    <div>
      <propositions v-model="propositions" class="propositions"/>
      <div class="proposition-user">
        <v-text-field label="Propose un message..."/>
        <v-btn color="primary">Send</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { propositions } from '../mocks'
  import Messages from './Messages'
  import Propositions from './Propositions'

  export default {
    components: {
      Messages,
      Propositions
    },
    name: 'Conversation',
    props: [
      'messages'
    ],
    data () {
      return {
        propositions: propositions
      }
    }
  }
</script>

<style scoped>
  .conversation {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex-grow: 1;
    /*overflow: auto;*/
  }

  .propositions {
    /*overflow: auto;*/
  }

  .proposition-user {
    /*display: flex;*/
  }
</style>
