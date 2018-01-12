<template>
  <div class="conversation">
    <messages v-model="messages" class="messages"/>
    <propositions v-model="propositions"
                  @new="$emit('newProposition', $event)" @delete="$emit('deleteProposition', $event)"
                  @up="$emit('upProposition', $event)" @down="$emit('downProposition', $event)"
                  class="propositions"/>
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
    flex: 0 0 0%; /* elasticity: from 0% ... */
    max-height: 35%; /* elasticity: ... to 35% */
  }
</style>
