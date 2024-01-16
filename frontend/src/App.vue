<template>
  <Navbar />
  <router-view></router-view>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: "App",
  components: {
    Navbar
  },
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
    this.connection = new WebSocket("wss://localhost:3069/");

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
