<template>
    <div>
        <form @submit.prevent="createPost" class="post-form"
            v-bind:style="[this.quoteForm ? 'padding: 0; margin-top: 10px; box-shadow: none;' : 'padding: 10px;']">
            <input v-if="!this.quoteForm" type="text" id="body" v-model="body" placeholder="Co u ciebie?" required>
            <input v-if="this.quoteForm" type="text" id="body" v-model="body" placeholder="Cytuj..." required>

            <div class="button-container">
                <button type="submit" class="submit-button">{{ !this.quoteForm ? "Dodaj post" : "Dodaj cytat" }}</button>
            </div>
            <div>{{ this.msg }}</div>
        </form>
    </div>
</template>
  
<script>
import { v4 as uuidv4 } from 'uuid';
import postsService from '@/service/postsService';

export default {
    name: "PostForm",
    props: {
        refreshPosts: {
            type: Function,
            required: true,
        },
        quoteForm: {
            type: Boolean,
            default: false
        },
        postId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            body: '',
            msg: '',
        };
    },
    methods: {
        createPost() {
            if (this.quoteForm) {
                postsService.createQuote({ id: uuidv4(), body: this.body }, this.$store.state.user.id, this.postId).then((res) => {
                    console.log("dodano cytat")
                    this.refreshPosts();
                })
            } else {
                postsService.createPost({ id: uuidv4(), body: this.body, author: this.$store.state.user.login }).then((res) => {
                    console.log("Dodano post");
                    this.refreshPosts();
                    // this.$router.go("/home")
                    // websocket dodac do powiadamiania uzytkowników !!!
                }).catch((err) => {
                    console.log(err)
                    // this.msg = err
                });
            }

            this.body = '';
            this.msg = '';
        }
    }
};
</script>
  
<style scoped>
.post-form {
    width: 100%;
    padding: 10px;
    background-color: rgb(57, 74, 95);
    border: 1px solid rgb(57, 74, 95);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
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

.message {
    margin-top: 10px;
    color: #e74c3c;
}
</style>
  