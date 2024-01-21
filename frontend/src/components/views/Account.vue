<template>
    <Navbar :user="actualUser" />
    <div class="account" v-if="user">
        <h1>Account</h1>
        <div class="user-info">
            <img src="@/assets/awatar.jpg" alt="awatar_default">
            <div class="user-details">
                <h2>&#64;{{ user.login }}</h2>
                <h5>{{ this.followed ? "Obserwowani: " + this.followed : "Brak obserwowanych" }}</h5>
                <h3>{{ user.email }}</h3>
            </div>
        </div>
        <div v-if="postsExists" class="posts">
            <Post v-for="post in posts" :key="post.id" :post="post" />
        </div>
        <div v-else>Użytkownik nie ma postów...</div>
    </div>
</template>

<script>
import userService from '@/service/userService';
import postsService from '@/service/postsService.js';
import Post from "@/components/Post.vue";
import Navbar from "@/components/Navbar.vue";
import { mapGetters } from "vuex";

export default {
    name: 'Account',
    props: ['id'],
    components: {
        Post,
        Navbar
    },
    data() {
        return {
            user: null,
            posts: [],
            followed: null,
        }
    },
    watch: {
        id() {
            this.getData();
        }
    },
    methods: {
        getData() {
            userService.getUserById(this.$props.id).then((response) => {
                this.user = response.data;
                userService.getFollowedUsers(this.$props.id).then(res => {
                    this.followed = res.data.length;
                }).catch(err => {
                    console.log(err);
                    localStorage.removeItem("user")
                    this.$router.go("/login");
                })
                postsService.getPostsByUserId(this.$props.id).then((res) => {
                    this.posts = [...res.data, ...this.posts];
                    postsService.getQuotesByUserId(this.$props.id).then((res) => {
                        this.posts = [...res.data, ...this.posts];
                    }).catch(err => {
                        console.log(err);
                        localStorage.removeItem("user")
                        this.$router.go("/login");
                    })
                }).catch(err => {
                    console.log(err);
                    localStorage.removeItem("user")
                    this.$router.go("/login");
                })
            }).catch(err => {
                console.log(err);
                localStorage.removeItem("user")
                this.$router.go("/login");
            })
        }
    },
    computed: {
        ...mapGetters({ actualUser: "getUser" }),
        postsExists() {
            if (this.posts && this.posts.length > 0) {
                return true
            }
            return false
        },
    },
    mounted() {
        this.getData();
    }
}
</script>

<style scoped>
.account {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.user-info {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.user-details {
    margin-left: 20px;
    text-align: left;
    color: white;
}

img {
    width: 100px;
    /* Dostosuj szerokość obrazka według potrzeb */
    height: auto;
    /* Zachowaj proporcje obrazka */
    border-radius: 50%;
    border: 2px solid #ccc;
}

.home {
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    margin: 10px 0;
}

.home:hover {
    background-color: #2980b9;
}
</style>