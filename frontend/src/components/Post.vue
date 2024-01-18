<template>
    <div class="post">
        <router-link :to="'/account/' + post.authorId">&#64;{{ post.author }}</router-link>
        <div>{{ post.body }}</div>
        <button>Cytuj</button>
        <button>Odpowiedz</button>
    </div>
</template>
  
<script>
export default {
    name: 'Post',
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>