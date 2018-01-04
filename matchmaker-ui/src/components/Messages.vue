<template>
  <div class="messages">
    <div v-for="message in [...value].reverse()" class="message-line" v-bind:class="[message.from === me ? 'sent' : 'received']">
      <small>{{message.sent_date | parseIso8601 | date}}</small>
      <div class="message-bubble">
        {{message.message}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Messages',
    props: {
      'value': {
        required: true,
        type: Array
      }
    },
    data () {
      return {
        me: '52b4d9ed6c5685412c0002a1'
      }
    }
  }
</script>

<style scoped>
  .messages {
    display: inline-block;
    width: 100%;
  }

  .message-line {
    margin: 8px 20px 8px 20px;
  }

  .received {
    float: left;
    clear: both;
  }

  .sent {
    float: right;
    clear: both;
  }

  .received > .message-bubble {
    background-color: #e8e8e8;
    border-radius: 16px 16px 16px 4px;
  }

  .sent > .message-bubble {
    background-color: #3ca4ff;
    border-radius: 16px 16px 4px 16px;
  }

  .message-bubble {
    padding: 10px 12px 10px 12px;
  }
</style>
