<template>
    <Navbar :user="user" />
    <div class="container" v-if="this.post">
        <div class="main-post">
            <Post :post="this.post" :refreshPosts="addComponentKey" :commenting="true" />
        </div>
        <div class="comments">
            <Post v-for="comment in comments" :post="comment" :refreshPosts="addComponentKey" />
        </div>
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
            post: null,
            componentKey: 0,
            comments: null
        }
    },
    watch: {
        componentKey() {
            this.getData();
        },
        id() {
            this.getData();
        }
    },
    methods: {
        addComponentKey() {
            this.componentKey += 1;
        },
        getData() {
            postsService.getPostById(this.$props.id).then(res => {
                this.post = res.data;
                postsService.getComments(this.$props.id).then(res => {
                    this.comments = res.data;
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
    mounted() {
        this.getData();
    }
};
</script>

<style scoped>
.comments,
.main-post {
    width: 100%;
}

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