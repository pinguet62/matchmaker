<template>
  <div class="propositions">
    <v-container class="propositions-list">
      <div v-for="proposition in value" :key="proposition._id" class="propositions-list-item">
        <div class="propositions-list-item-actions">
          <v-btn icon small @click="$emit('delete', proposition)" disabled>
            <v-icon small>delete</v-icon>
          </v-btn>

          <v-badge left color="green darken-2">
            <span slot="badge">+{{proposition.up || 0}}</span>
            <v-btn icon small @click="$emit('up', proposition)">
              <v-icon small color="green darken-2">thumb_up</v-icon>
            </v-btn>
          </v-badge>

          <v-badge left color="red darken-2">
            <span slot="badge">-{{proposition.down || 0}}</span>
            <v-btn icon small @click="$emit('down', proposition)">
              <v-icon small color="red darken-2">thumb_down</v-icon>
            </v-btn>
          </v-badge>
        </div>
        <div class="propositions-list-item-text">{{proposition.message}}</div>
      </div>
    </v-container>

    <v-btn absolute right top fab color="pink" dark @click="newPropositionDialog = true" class="propositions-button">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="newPropositionDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-text-field v-model="input" label="Propose un message..."/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="submitNewProposition()" color="primary">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Propositions',
    props: {
      'value': {
        required: true,
        type: Array
      }
    },
    data () {
      return {
        input: null,
        newPropositionDialog: false
      }
    },
    methods: {
      submitNewProposition () {
        this.$emit('new', this.input)
        this.newPropositionDialog = false
        this.input = null
      }
    }
  }
</script>

<style scoped>
  .propositions {
    position: relative; /* floating button */
  }

  .propositions-list {
    overflow: auto; /* elasticity: limited so allow scroll */
    height: 100%; /* scroll display */
  }

  .propositions-list-item {
    display: flex;
    align-items: center;
  }

  .propositions-list-item-actions {
    display: flex;
  }

  .propositions-button {
    right: 25px;
  }
</style>
