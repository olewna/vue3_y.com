<template>
    <div class="container">
        <h1>Serwis Y</h1>
        <div class="login">
            <h2>Logowanie</h2>
            <form @submit.prevent="login">
                <label for="email">Email:</label>
                <input type="text" id="email" v-model="email" placeholder="email..." required>

                <label for="password">Hasło:</label>
                <input type="password" id="password" v-model="password" placeholder="hasło..." required>

                <button type="submit">Zaloguj</button>
                <div>{{ this.msg }}</div>
            </form>
            <router-link to="/register">Zarejestuj się</router-link>
        </div>
    </div>
</template>
  
<script>
import loginService from '@/service/loginService';
import router from "@/router/router.js"

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
            loginService.login({ email: this.email, password: this.password }).then((res) => {
                this.email = '';
                this.password = '';

                console.log("Zalogowano")
                localStorage.setItem("user", JSON.stringify(res.data));
                this.$router.go("/home")
            }).catch((err) => {
                console.log("Problem z logowaniem")
                this.msg = "Problem z logowaniem"
            });
        }
    },
    created() {
        // console.log(this.$store.state.logged)
        if (this.$store.state.logged) {
            router.push('/home');
        }
    },
};
</script>
  
<style scoped>
.container {
    height: 100%;
    margin: 0;
}

.login {
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
  