<template>
    <div class="users">
        <div>Obserwowani:</div>
        <div class="followed" v-if="followedUsers" v-for="user in followedUsers">
            {{ user.login }}
            <button>Przestań obserwować</button>
        </div>
        <div>Możliwe, że znasz:</div>
        <div class="not-followed" v-if="notFollowedUsers" v-for="user in notFollowedUsers">
            {{ user.login }}
            <button>Obserwuj</button>
        </div>
    </div>
</template>

<script>
import userService from '@/service/userService';

export default {
    name: 'Aside',
    props: {
        user: Object
    },
    data() {
        return {
            followedUsers: null,
            notFollowedUsers: null
        }
    },
    mounted() {
        userService.getFollowedUsers(this.user.id).then(res => {
            this.followedUsers = res.data;
            userService.getNotFollowedUsers(this.user.id).then(response => {
                this.notFollowedUsers = response.data;
            }).catch(err => {
                console.log(err);
                localStorage.removeItem("user")
                this.$router.go("/login");
            })
        }).catch(err => {
            console.log(err);
            localStorage.removeItem("user")
            this.$router.go("/login");
        })
    }
}
</script>

<style scoped>
.users {
    min-width: 200px;
}
</style>