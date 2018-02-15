<template>
  <v-snackbar v-model="show" :timeout="500" :top="true" :vertical="true">
    <h1>{{title}}</h1>
    <p>{{details}}</p>
  </v-snackbar>
</template>

<script>
  import Vue from 'vue'

  export const AlertPopupBus = new Vue()

  export default {
    data () {
      return {
        show: false,
        title: null,
        details: null
      }
    },
    created () {
      AlertPopupBus.$on('display', data => {
        this.title = data.title
        this.details = data.details
        this.show = true
      })
    }
  }
</script>
