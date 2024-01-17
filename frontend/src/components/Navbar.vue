import loginService from '@/service/loginService';
<template>
    <div class="navbar">
        | <div>„Serwis Y”</div> |
        <router-link to="/home">Lista osób</router-link> |
        <router-link to="/account">konto {{ user.login }}</router-link> |
        <div @click="logout">Wyloguj</div>
    </div>
</template>

<script>
import loginService from "@/service/loginService.js";

export default {
    name: "Navbar",
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        logout() {
            loginService.logout().then(res => {
                console.log("wylogowano");
                localStorage.removeItem("user")
                this.$router.go("/login");
            }).catch((err) => {
                console.log(err)
            })
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-around;
}
</style>
