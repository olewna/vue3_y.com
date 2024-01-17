<template>
  <router-view></router-view>
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
    this.connection = new WebSocket("wss://localhost:3069/");

    this.connection.onmessage = function (event) {
      console.log(event.data)
    }

    this.connection.onopen = function (event) {
      console.log("success connection ")
    }
  },
  beforeCreate() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.$store.commit('SET_USER', userData);
      this.$store.commit("SET_ISLOGGED", true)
    }
  },
}
</script>

<style scoped></style>
