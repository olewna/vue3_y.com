<template>
    <Navbar :user="user" />
    <div class="body">
        <Aside :user="user" />
        <div class="home">
            <h1>Home!</h1>
            <PostForm />
            <Post v-if="postsExists" v-for="post in posts" :key="post.id" :post="post" />
            <div v-else>No posts...</div>
        </div>
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
import Aside from "@/components/Aside.vue";
import router from "@/router/router.js"


export default {
    name: "Home",
    components: {
        Navbar,
        Post,
        PostForm,
        Aside
    },
    data() {
        return {
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
        getData() {
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
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style scoped>
.body {
    display: flex;
}

.home {
    max-width: 500px;
    margin: 0 auto;
}
</style>