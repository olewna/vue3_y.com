<template>
    <div>
        <h2>Logowanie</h2>
        <form @submit.prevent="login">
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="email" required>

            <label for="password">Hasło:</label>
            <input type="password" id="password" v-model="password" required>

            <button type="submit">Zaloguj</button>
            <div>{{ this.msg }}</div>
            <router-link to="/register">Zarejestuj się</router-link>
        </form>
    </div>
</template>
  
<script>
import loginService from '../../service/loginService';

export default {
    name: "Login",
    data() {
        return {
            email: '',
            password: '',
            msg: '',
        };
    },
    methods: {
        login() {
            // W tym miejscu można wywołać funkcję logowania i przekazać dane do rodzica
            loginService.login({ email: this.email, password: this.password }).then((res) => {
                console.log(res);
                this.$router.push({ path: "/home" })
            }).catch((err) => {
                console.log(err.response.data.msg)
                this.msg = err.response.data.msg
            });

            // Opcjonalnie, można wyczyścić pola formularza po zalogowaniu
            this.email = '';
            this.password = '';
        }
    }
};
</script>
  
<style scoped>
/* Opcjonalne style komponentu */
</style>
  