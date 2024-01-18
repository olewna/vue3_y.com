<template>
    <div class="post">
        <h1>{{ post.body }}</h1>
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