<template>
  <div>
    <v-text-field v-model="sharedLinkLink"></v-text-field>
    <v-btn @click="goToLink()">Go to!</v-btn>
  </div>
</template>

<script>
  export default {
    name: 'LinkSelection',
    data () {
      return {
        sharedLinkLink: null
      }
    },
    methods: {
      goToLink () {
        this.$router.push(`/user/${this.sharedLinkLink}`)
      }
    }
  }
</script>
