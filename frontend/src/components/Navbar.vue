<template>
    <div class="navbar">
        | <div>„Serwis Y”</div> |
        <router-link to="/home">Lista osób</router-link> |
        <router-link to="/login">konto usera</router-link>|
    </div>
</template>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-around;
}
</style>
