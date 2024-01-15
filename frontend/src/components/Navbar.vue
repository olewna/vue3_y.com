<template>
    <div class="navbar">
        | <div>„Serwis Y”</div> |
        <router-link to="/home">Lista osób</router-link> |
        <router-link v-if="!logged" to="/login">Zaloguj</router-link>
        <router-link v-else to="/login">konto USERLOGIN</router-link> |
    </div>
</template>

<script>
export default {
    name: "Navbar",
    data() {
        return {
            logged: null
        }
    },
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-around;
}
</style>
