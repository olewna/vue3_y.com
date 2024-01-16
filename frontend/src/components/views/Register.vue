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
            // W tym miejscu można wywołać funkcję logowania i przekazać dane do rodzica
            userService.createUser({ login: this.login, email: this.email, password: this.password }).then((res) => {
                console.log(res);
                this.$router.push({ path: "/login" })
            }).catch((err) => {
                console.log(err.response.data.msg)
                this.msg = err.response.data.msg
            });

            // Opcjonalnie, można wyczyścić pola formularza po zalogowaniu
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
  