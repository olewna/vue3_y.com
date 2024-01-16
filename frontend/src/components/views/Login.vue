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
import loginService from '@/service/loginService';
import { mapActions } from "vuex";

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
        ...mapActions(["setUser", "setIsLogged"]),
        login() {
            // W tym miejscu można wywołać funkcję logowania i przekazać dane do rodzica
            loginService.login({ email: this.email, password: this.password }).then((res) => {
                this.setUser(res.data)
                this.email = '';
                this.password = '';
                this.setIsLogged(true)
                this.$router.push({ path: "/home" })
            }).catch((err) => {
                console.log(err.response.data.msg)
                this.msg = err.response.data.msg
            });
        }
    },
    created() {
        console.log(this.$store.state.logged)
        if (this.$store.state.logged) {
            this.$router.push('/home');
        }
    },
};
</script>
  
<style scoped>
/* Opcjonalne style komponentu */
</style>
  