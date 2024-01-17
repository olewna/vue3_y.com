<template>
    <Navbar :user="user" />
    <h1>Home!</h1>

    <Post v-for="post in posts" :key="post.id" :post="post" />
</template>

<script>
import { watchEffect, computed } from "vue";
import { mapGetters } from "vuex";
import userService from '@/service/userService';
import postsService from '@/service/postsService';
import Navbar from '@/components/Navbar.vue'
import Post from '@/components/Post.vue'


export default {
    name: "Home",
    components: {
        Navbar,
        Post
    },
    data() {
        return {
            users: null,
            posts: null
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
                    postsService.getPosts()
                        .then(response => {
                            this.posts = response.data;
                        })
                        .catch(err => {
                            console.log(err);
                            localStorage.removeItem("user")
                            this.$router.go("/login");
                        })
                })
                .catch(err => {
                    console.log(err);
                    localStorage.removeItem("user")
                    this.$router.go("/login");
                    // this.$router.push({ name: 'NetworkError' })
                })

        })

    },
}
</script>
