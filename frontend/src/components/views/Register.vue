<template>
    <div>
        <h2>Rejestracja</h2>
        <form @submit.prevent="register">
            <label for="login">Login:</label>
            <input type="text" id="login" v-model="login" required>

            <label for="email">Email:</label>
            <input type="text" id="email" v-model="email" required>

            <label for="password">Hasło:</label>
            <input type="password" id="password" v-model="password" required>

            <button type="submit">Stwórz konto</button>
            <div>{{ this.msg }}</div>
            <router-link to="/login">Logowanie</router-link>
        </form>
    </div>
</template>
  
<script>
import userService from "@/service/userService"
import { v4 as uuidv4 } from 'uuid';

export default {
    name: "Register",
    data() {
        return {
            login: '',
            email: '',
            password: '',
            msg: '',
        };
    },
    methods: {
        register() {
            userService.createUser({ id: uuidv4(), login: this.login, email: this.email, password: this.password }).then((res) => {
                console.log(res);
                this.$router.go("/login")
            }).catch((err) => {
                console.log(err.response.data.msg)
                this.msg = err.response.data.msg
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
  