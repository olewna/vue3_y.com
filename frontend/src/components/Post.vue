<template>
    <div class="post" @click="redirectToPost(post.id)">
        <div class="link" @click="redirectToAccount(post.authorId)">&#64;{{ post.author }}</div>
        <div class="post-body">{{ post.body }}</div>
        <div class="quote" @click="redirectToPost(post.postId)" v-if="post.postId && quoted">
            <div class="link" @click="redirectToAccount(this.quoted.authorId)">&#64;{{ this.quoted.author }}</div>
            <div class="post-body">{{ this.quoted.body }}</div>
        </div>
        <button class="quote-button" @click="showQuoteForm">Cytuj</button>
        <button class="reply-button">Odpowiedz</button>
        <PostForm v-if="this.isQuote" :refreshPosts="this.refreshPosts" :quoteForm="true" :postId="post.id" />
    </div>
</template>
  
<script>
import PostForm from '@/components/PostForm.vue';
import postsService from '@/service/postsService';

export default {
    name: 'Post',
    components: {
        PostForm
    },
    props: {
        post: {
            type: Object,
            required: true
        },
        refreshPosts: {
            type: Function,
        },
    },
    data() {
        return {
            isQuote: false,
            quoted: null
        }
    },
    methods: {
        showQuoteForm() {
            this.isQuote = !this.isQuote;
        },
        redirectToPost(id) {
            this.$router.push("/post/" + id)
        },
        redirectToAccount(authorId) {
            this.$router.push('/account/' + authorId);
        }
    },
    mounted() {
        if (this.post.postId) {
            postsService.getPostById(this.post.postId).then(res => {
                this.quoted = res.data;
            }).catch(err => {
                console.log(err);
                localStorage.removeItem("user")
                this.$router.go("/login");
            })
        }
    }
}
</script>

<style scoped>
.quote {
    border: 1px solid rgb(27, 35, 45);
    border-radius: 8px;
    padding: 5px;
    margin-top: 10px;
}

.post {
    border: 1px solid rgb(57, 74, 95);
    padding: 10px;
    margin: 10px 0;
    background-color: rgb(57, 74, 95);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    cursor: pointer;
}

.link {
    width: fit-content;
    color: black;
    text-align: left;
    cursor: pointer;
}

.link:hover {
    text-decoration: underline;
}

a {
    text-decoration: none;
    color: black;
}

.post-body {
    color: white;
    margin-top: 10px;
    width: 100%;
    text-align: left;
    height: auto;
}

button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #2980b9;
}

.quote-button {
    margin-right: 10px;
}

.reply-button {
    background-color: #27ae60;
}

.reply-button:hover {
    background-color: #218c54;
}
</style>