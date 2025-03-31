<script setup lang="ts">
const router = useRouter();

useHead({
    title: "Bug Viewer"
})

const issue = ref("");
const loading = ref(false);
const error = ref(false);

function go() {
    if (/[mM][cC]-\d+/.test(issue.value)) {
        router.push(issue.value.toUpperCase());
        loading.value = true;
    } else {
        error.value = true;
    }
}
</script>

<template>
    <div class="mb-2">An in-progress alternative to Mojang's offical bug viewer which requires log-in to view attachments and also doesn't even show all the issue information.</div>

    Enter a bug name like "MC-4" into the box: (Only works with Java bugs - other projects coming soon)
    <br>
    <input type="text" :class="['window transition-[border-color] duration-200 border-2 border-c2', {'border-red-500': error}]"
           placeholder="Bug ID" v-model="issue" @keydown.enter="go" @transitionend="error = false">
    <button class="window ml-2 cursor-pointer" @click="go">Go</button>
    <br>
    Please report issues <a href="https://github.com/T0RNATO/mojira/issues/new">on GitHub</a>
    <br>
    <div v-if="loading" class="mt-4">
        Your bug is loading... please be patient, the Jira API is slow.
    </div>
</template>

<style scoped>

</style>