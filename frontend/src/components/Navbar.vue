import loginService from '@/service/loginService';
<template>
    <div class="navbar">
        | <div>„Serwis Y”</div> |
        <router-link to="/home">Lista osób</router-link> |
        <router-link class="account" :to="'/account/' + user.id">konto {{ user.login }} <img src="@/assets/awatar.jpg"
                alt="awatar_default"></router-link> |
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
    align-items: center;
}

.account {
    display: flex;
    align-items: center;

}

img {
    margin-left: 10px;
    width: 30px;
}
</style>
