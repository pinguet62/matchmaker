<template>
  <div class="conversation">
    <messages v-model="messages" class="messages"/>
    <propositions v-model="propositions" class="propositions"/>
  </div>
</template>

<script>
  import Messages from './Messages'
  import Propositions from './Propositions'

  export default {
    components: {
      Messages,
      Propositions
    },
    name: 'Conversation',
    props: [
      'messages',
      'propositions'
    ]
  }
</script>

<style scoped>
  .conversation {
    height: 100%;
    display: flex; /* elasticity */
    flex-direction: column; /* elasticity */
  }

  .messages {
    flex: 1; /* elasticity: use full free space */
    overflow: auto; /* elasticity: limited so allow scroll */
  }

  .propositions {
    max-height: 25%; /* elasticity: proportion */
  }
</style>
