<template>
    <Navbar :user="user" />
    <div>
        <h1>
            PAGE NOT FOUND 404 Mr. {{ user.login }}
        </h1>
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