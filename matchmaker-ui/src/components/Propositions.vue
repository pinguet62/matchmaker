<template>
  <div class="propositions">
    <div class="propositions-list">
      <div v-for="proposition in value" class="propositions-list-item">
        <v-badge>
          <span slot="badge">+{{proposition.up}}</span>
          <v-btn icon @click="upProposition(proposition)">
            <v-icon>thumb_up</v-icon>
          </v-btn>
        </v-badge>

        <v-badge right>
          <span slot="badge">-{{proposition.down}}</span>
          <v-btn icon @click="downProposition(proposition)">
            <v-icon>thumb_down</v-icon>
          </v-btn>
        </v-badge>

        <v-btn icon @click="deleteProposition(proposition)">
          <v-icon>delete</v-icon>
        </v-btn>

        <div>{{proposition.message}}</div>
      </div>
    </div>

    <div><!--fix-->
      <div class="propositions-input">
        <v-text-field label="Propose un message..."/>
        <v-btn color="primary">Send</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Propositions',
    props: {
      'value': {
        required: true,
        type: Array,
        validator: value2 => value2.every(value => value.message && value.up && value.down)
      }
    },
    methods: {
      deleteProposition (proposition) {
        // TODO
      },
      upProposition (proposition) {
        proposition.up++ // TODO
        console.log('TODO', '+1: ' + JSON.stringify(proposition))
      },
      downProposition (proposition) {
        proposition.down-- // TODO
      }
    }
  }
</script>

<style scoped>
  .propositions {
    display: flex; /* elasticity */
    flex-direction: column; /* elasticity */
  }

  .propositions-list {
    flex: 1; /* elasticity: use full free space */
    overflow: auto; /* elasticity: limited so allow scroll */
  }

  .propositions-list-item {
    display: flex;
    align-items: center;
  }

  .propositions-input {
    display: flex;
    align-items: center;
  }
</style>
