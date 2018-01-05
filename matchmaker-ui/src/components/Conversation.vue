<template>
  <div class="conversation">
    <messages v-model="messages" class="messages"/>
    <div class="propositions">
      <propositions v-model="propositions" class="proposition-list"/>
      <div class="proposition-input">
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
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex: 1;
    overflow: auto;
  }

  .propositions {
    max-height: 25%;
    overflow: auto;
  }

  .proposition-list {
    overflow: auto;
  }

  .proposition-input {
    /*display: flex;*/
  }
</style>
