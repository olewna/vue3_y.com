<template>
  <router-view></router-view>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      socket: null
    }
  },
  methods: {
    createSocketConnection() {
      const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3069";
      this.socket = io(URL, {
        // autoConnect: false,
        withCredentials: true
      });
    }
  },
  created() {
    this.createSocketConnection();
  },
  mounted() {
    this.socket.emit('message', { text: "elo" })

  },
  beforeCreate() {
    const userData = localStorage.getItem('user');
    // console.log(JSON.parse(userData))
    if (userData) {
      this.$store.commit('SET_USER', JSON.parse(userData));
      this.$store.commit("SET_ISLOGGED", true)
    }
  },
}
</script>

<style scoped></style>
