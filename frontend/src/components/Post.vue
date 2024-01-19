<template>
    <div class="post">
        <div class="link"><router-link :to="'/account/' + post.authorId">&#64;{{ post.author }}</router-link></div>
        <div class="post-body">{{ post.body }}</div>
        <button class="quote-button">Cytuj</button>
        <button class="reply-button" @click="showAnswerForm">Odpowiedz</button>
        <PostForm v-if="this.answer" :refreshPosts="this.refreshPosts" :answerForm="true" :postId="post.id" />

    </div>
</template>
  
<script>
import PostForm from '@/components/PostForm.vue';

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
            required: true,
        },
    },
    data() {
        return {
            answer: false,
        }
    },
    methods: {
        showAnswerForm() {
            this.answer = !this.answer;
        }
    }
}
</script>

<style scoped>
.post {
    border: 1px solid rgb(57, 74, 95);
    padding: 10px;
    margin: 10px 0;
    background-color: rgb(57, 74, 95);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
}

.link {
    width: 100%;
    text-align: left;
}

a {
    color: black;
}

.post-body {
    color: white;
    margin-top: 10px;
    width: 100%;
    text-align: left;
    height: auto;
    min-height: 50px;
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