<template>
    <div class="account" v-if="user">
        <h1>Account</h1>
        <div class="user-info">
            <img src="@/assets/awatar.jpg" alt="awatar_default">
            <div class="user-details">
                <h2>&#64;{{ user.login }}</h2>
                <h5>{{ user.id }}</h5>
                <h3>{{ user.email }}</h3>
            </div>
        </div>
        <router-link to="/home">Strona główna</router-link>
    </div>
</template>

<script>
import userService from '@/service/userService';

export default {
    name: 'Account',
    props: ['id'],
    data() {
        return {
            user: null,
        }
    },
    created() {
        userService.getUserById(this.$props.id).then((response) => {
            this.user = response.data;
            console.log(response.data)
        }).catch(err => {
            console.log(err);
        })
    }
}
</script>

<style scoped>
.account {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.user-info {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.user-details {
    margin-left: 20px;
    text-align: left;
    color: white;
}

img {
    width: 100px;
    /* Dostosuj szerokość obrazka według potrzeb */
    height: auto;
    /* Zachowaj proporcje obrazka */
    border-radius: 50%;
    border: 2px solid #ccc;
}

router-link {
    margin-top: 20px;
    text-decoration: none;
    color: #3498db;
}
</style>