<template>
    <Navbar :user="user" />
    <div class="body">
        <Aside :user="user" :refreshPosts="addComponentKey" />
        <div class="home">
            <h1>Home!</h1>
            <PostForm :refreshPosts="addComponentKey" />
            <div v-if="this.newPosts" class="button-container"><button @click="this.getData()">Nowe posty
                    obserwowanych</button></div>
            <Post v-if="postsExists" v-for="post in posts" :key="post.id" :post="post" :refreshPosts="addComponentKey" />
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
            posts: [],
            componentKey: 0,
            newPosts: false
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
    watch: {
        componentKey() {
            this.getData();
        }
    },
    methods: {
        getData() {
            postsService.getPosts(this.user.id)
                .then(res => {
                    // console.log(res.data);
                    this.posts = res.data;
                    postsService.getQuotes(this.user.id).then(res => {
                        this.posts = [...res.data, ...this.posts];
                    }).catch(err => {
                        console.log(err);
                        localStorage.removeItem("user")
                        this.$router.go("/login");
                    })
                })
                .catch(err => {
                    console.log(err);
                    localStorage.removeItem("user")
                    this.$router.go("/login");
                })
            this.newPosts = false;
        },
        addComponentKey() {
            this.componentKey += 1;
        }
    },
    mounted() {
        this.getData();
        this.$store.state.socket.on("newPost", () => {
            console.log("Otrzymano nowy post!");
            this.newPosts = true;
        })
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

.button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
}

button {
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
}

button:hover {
    background-color: #2980b9;
}
</style>