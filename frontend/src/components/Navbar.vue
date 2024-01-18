import loginService from '@/service/loginService';
<template>
    <div class="navbar">
        <div class="brand">„Serwis Y”</div> |
        <router-link to="/home" class="nav-link">Lista osób</router-link> |
        <router-link class="account nav-link" :to="'/account/' + user.id">
            Konto {{ user.login }} <img src="@/assets/awatar.jpg" alt="awatar_default">
        </router-link> |
        <div class="logout nav-link" @click="logout">Wyloguj</div>
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
    background-color: rgb(31 33 36);
    color: #fff;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand {
    font-weight: bold;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    margin: 0 10px;
    cursor: pointer;
}

.nav-link:hover {
    text-decoration: underline;
}

a.account {
    display: flex;
    align-items: center;
}

.account img {
    width: 20px;
    height: auto;
    margin-left: 5px;
    border-radius: 50%;
}

.logout {
    cursor: pointer;
}

.logout:hover {
    text-decoration: underline;
}
</style>