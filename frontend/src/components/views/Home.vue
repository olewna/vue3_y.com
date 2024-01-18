<template>
    <Navbar :user="user" />
    <div class="home">
        <h1>Home!</h1>
        <PostForm />
        <Post v-if="postsExists" v-for="post in posts" :key="post.id" :post="post" />
        <div v-else>No posts...</div>
    </div>
</template>

<script>
import { watchEffect, computed } from "vue";
import { mapGetters } from "vuex";
import userService from '@/service/userService';
import postsService from '@/service/postsService';
import Navbar from '@/components/Navbar.vue'
import Post from '@/components/Post.vue'
import PostForm from '@/components/PostForm.vue'
import router from "@/router/router.js"


export default {
    name: "Home",
    components: {
        Navbar,
        Post,
        PostForm
    },
    data() {
        return {
            users: null,
            posts: null
        }
    },
    computed: {
        ...mapGetters({ user: "getUser" }),
        postsExists() {
            if (this.posts && this.posts.length > 0) {
                return true
            }
            return false
        }
    },
    methods: {
        getData: function () {
            userService.getUsers()
                .then(response => {
                    this.users = response.data;
                    postsService.getPosts()
                        .then(res => {
                            console.log(res.data);
                            this.posts = res.data;
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
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style scoped>
.home {
    max-width: 500px;
    margin: 0 auto;
}
</style>