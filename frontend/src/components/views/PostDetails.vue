<template>
    <div class="container" v-if="this.post">
        <Post :post="this.post" />
        <router-link to="/home">Strona główna</router-link>
    </div>
</template>
  
<script>
import postsService from '@/service/postsService';
import Post from "@/components/Post.vue"

export default {
    name: "PostDetails",
    props: ["id"],
    components: {
        Post
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