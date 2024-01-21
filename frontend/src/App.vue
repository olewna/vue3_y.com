<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      socket: null
    }
  },
  methods: {
    createSocketConnection() {
      this.$store.dispatch("initializeSocket");
    }
  },
  created() {
    this.createSocketConnection();
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
