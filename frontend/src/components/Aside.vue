<template>
    <div class="users">
        <div class="container-followed" v-if="followedUsers.length > 0">
            <div>Obserwowani: {{ followedUsers.length }}</div>
            <div class="followed" v-for="user in followedUsers">
                <div class="link" @click="redirectToAccount(user.id)">{{ user.login }}</div>
                <button @click="unfollow(user.id)">Przestań obserwować</button>
            </div>
        </div>
        <div class="container-not-followed" v-if="notFollowedUsers.length > 0">
            <div>Możliwe, że znasz:</div>
            <div class="not-followed" v-for="user in notFollowedUsers">
                <div class="link" @click="redirectToAccount(user.id)">{{ user.login }}</div>
                <button @click="follow(user.id)">Obserwuj</button>
            </div>
        </div>
    </div>
</template>

<script>
import userService from '@/service/userService';

export default {
    name: 'Aside',
    props: {
        user: Object,
        refreshPosts: {
            type: Function
        }
    },
    data() {
        return {
            followedUsers: [],
            notFollowedUsers: [],
            componentKey: 0
        }
    },
    methods: {
        unfollow(userIdToUnfollow) {
            userService.unfollowUser({ follow: this.user.id, isFollowed: userIdToUnfollow }).then(res => {
                // console.log(res.data)
                this.componentKey += 1;
                this.refreshPosts();
                // this.$router.go("/home");
            }).catch(err => {
                console.log(err);
                localStorage.removeItem("user")
                this.$router.go("/login");
            })
        },
        follow(userIdToFollow) {
            userService.followUser({ follow: this.user.id, isFollowed: userIdToFollow }).then(res => {
                // console.log(res.data)
                this.componentKey += 1;
                this.refreshPosts();

                // this.$router.go("/home");
            }).catch(err => {
                console.log(err);
                localStorage.removeItem("user")
                this.$router.go("/login");
            })
        },
        loadData() {
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
        },
        redirectToAccount(authorId) {
            this.$router.push('/account/' + authorId);
        }
    },
    watch: {
        componentKey() {
            this.loadData();
        }
    },
    mounted() {
        this.loadData();
    }
}
</script>

<style scoped>
.link {
    cursor: pointer;
}

.link:hover {
    text-decoration: underline;
}

.users {
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.followed,
.not-followed {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
}

button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>