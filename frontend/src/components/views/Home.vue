<template>
    <Navbar :user="user" />
    <h1>Home!</h1>
    <div v-for="user in users">
        {{ user.login }}
    </div>
</template>

<script>
import { watchEffect, computed } from "vue";
import { mapGetters } from "vuex";
import userService from '@/service/userService';
import Navbar from '@/components/Navbar.vue'


export default {
    name: "Home",
    components: {
        Navbar
    },
    data() {
        return {
            users: null
        }
    },
    computed: {
        ...mapGetters({ user: "getUser" })
    },
    created() {
        watchEffect(() => {
            this.users = null;
            userService.getUsers()
                .then(response => {
                    this.users = response.data;
                })
                .catch(err => {
                    console.log(err);
                    // this.$router.push({ name: 'NetworkError' })
                })
        })

    },
}
</script>
