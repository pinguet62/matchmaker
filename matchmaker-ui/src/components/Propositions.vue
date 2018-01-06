<template>
  <div class="propositions">
    <div class="propositions-list">
      <div v-for="proposition in value" :key="proposition._id" class="propositions-list-item">
        <v-badge>
          <span slot="badge">+{{proposition.up}}</span>
          <v-btn icon @click="$emit('up', proposition)">
            <v-icon>thumb_up</v-icon>
          </v-btn>
        </v-badge>

        <v-badge right>
          <span slot="badge">-{{proposition.down}}</span>
          <v-btn icon @click="$emit('down', proposition)">
            <v-icon>thumb_down</v-icon>
          </v-btn>
        </v-badge>

        <v-btn icon @click="$emit('delete', proposition)">
          <v-icon>delete</v-icon>
        </v-btn>

        <div>{{proposition.message}}</div>
      </div>
    </div>

    <div><!--fix-->
      <div class="propositions-input">
        <v-text-field v-model="input" label="Propose un message..."/>
        <v-btn @click="submitNewProposition()" color="primary">Send</v-btn>
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
        type: Array
      }
    },
    data () {
      return {
        'input': null
      }
    },
    methods: {
      submitNewProposition () {
        let proposition = {message: this.input}
        this.$emit('new', proposition)
        this.input = null
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
