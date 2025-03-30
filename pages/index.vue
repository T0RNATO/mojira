<script setup lang="ts">
const router = useRouter();

useHead({
    title: "Bug Viewer"
})

const issue = ref("");
</script>

<template>
    <h1>Bug Viewer</h1>
    <div class="my-2">An in-progress alternative to Mojang's offical bug viewer which requires log-in to view attachments and also doesn't even show all the issue information.</div>

    Enter a bug name like "MC-4" into the box: (Only works with Java bugs, sorry)
    <br>
    <input type="text" class="window" placeholder="Bug ID" v-model="issue" @keydown.enter="router.push(issue)">
    <button class="window ml-2 cursor-pointer" @click="router.push(issue)">Go</button>
    <br>
    Please report issues <a href="https://github.com/T0RNATO/mojira/issues/new">on GitHub</a>
</template>

<style scoped>

</style>