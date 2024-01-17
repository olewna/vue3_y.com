<template>
    <div class="container">
        <h1>Serwis Y</h1>
        <div class="register">
            <h2>Rejestracja</h2>
            <form @submit.prevent="register">
                <label for="login">Login:</label>
                <input type="text" id="login" v-model="login" placeholder="login..." required>

                <label for="email">Email:</label>
                <input type="text" id="email" v-model="email" placeholder="email..." required>

                <label for="password">Hasło:</label>
                <input type="password" id="password" v-model="password" placeholder="hasło..." required>

                <button type="submit">Stwórz konto</button>
                <div>{{ this.msg }}</div>
                <router-link to="/login">Logowanie</router-link>
            </form>
        </div>
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
.container {
    height: 100%;
    margin: 0;
}

.register {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2,
h1 {
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 8px;
}

input {
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #2980b9;
}

div {
    margin-top: 10px;
}

a {
    margin-top: 10px;
    text-align: center;
    text-decoration: none;
    color: #3498db;
    display: block;
    text-decoration: underline;
}

a:hover {
    color: #2980b9;
}
</style>
  