<template>
    <h1>Home!</h1>
    <div v-for="user in users">
        {{ user.login }}
    </div>
</template>

<script>
import userService from '../../service/userService';
import { watchEffect } from "vue"

export default {
    name: "Home",
    data() {
        return {
            users: null
        }
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
