<template>
    <Navbar :user="user" />
    <div class="container" v-if="this.post">
        <Post :post="this.post" />
        <router-link to="/home">Strona główna</router-link>
    </div>
</template>
  
<script>
import postsService from '@/service/postsService';
import Post from "@/components/Post.vue"
import { mapGetters } from "vuex";
import Navbar from "@/components/Navbar.vue";

export default {
    name: "PostDetails",
    props: ["id"],
    components: {
        Post,
        Navbar
    },
    computed: {
        ...mapGetters({ user: "getUser" }),
    },
    data() {
        return {
            post: null
        }
    },
    created() {
        postsService.getPostById(this.$props.id).then(res => {
            this.post = res.data;
        }).catch(err => {
            console.log(err);
            localStorage.removeItem("user")
            this.$router.go("/login");
        })
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
</style>