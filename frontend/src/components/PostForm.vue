<template>
    <div>
        <form @submit.prevent="createPost">
            <label for="body">Nowy post:</label>
            <input type="text" id="body" v-model="body" placeholder="Co u ciebie?" required>

            <button type="submit">Dodaj post</button>
            <div>{{ this.msg }}</div>
        </form>
    </div>
</template>
  
<script>
import { v4 as uuidv4 } from 'uuid';
import postsService from '@/service/postsService';

export default {
    name: "PostForm",
    data() {
        return {
            body: '',
            msg: '',
        };
    },
    methods: {
        createPost() {
            postsService.createPost({ id: uuidv4(), body: this.body, author: this.$store.state.user.login }).then((res) => {
                console.log(res);
                this.$router.go("/home")
                // websocket dodac do powiadamiania uzytkowników !!!
            }).catch((err) => {
                console.log(err)
                // this.msg = err
            });

            this.login = '';
            this.email = '';
            this.password = '';
        }
    }
};
</script>
  
<style scoped>
/* Opcjonalne style komponentu */
</style>
  