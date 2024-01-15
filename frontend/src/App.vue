<template>
  <div id="app">
    <h2>Serwis Y</h2>'
    <button v-on:click="sendMessage('helo')">Send Message</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      connection: null
    }
  },
  methods: {
    sendMessage: function (message) {
      console.log("wysłano wiadomość: " + message);
      this.connection.send(message);
    }
  },
  created: function () {
    console.log("Starting web socket server");
    this.connection = new WebSocket("wss://localhost:3069");

    this.connection.onmessage = function (event) {
      console.log(event.data)
    }

    this.connection.onopen = function (event) {
      console.log("success connection ")
    }
  }
}
</script>

<style scoped></style>
