<template>
  <v-container>
    <v-layout justify-center>
      <v-flex lg3>
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>User</v-toolbar-title>
          </v-toolbar>
          <v-card-text align="center">
            Please fill in the <i>code</i> shared by the person who wants help.
            <v-text-field v-model="sharedLinkLink" label="Code"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="success" @click="goToLink()">Go to!</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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
