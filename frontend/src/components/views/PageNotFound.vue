<template>
    <Navbar :user="user" />
    <div>
        <h1>
            PAGE NOT FOUND 404 mr {{ user.login }}
        </h1>
        <router-link to="/home">Strona główna</router-link>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "@/components/Navbar.vue";

export default {
    name: "PageNotFound",
    components: {
        Navbar
    },
    computed: {
        ...mapGetters({ user: "getUser" }),
    }
}
</script>