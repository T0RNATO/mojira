<script setup lang="ts">
const { data } = await useFetch("/api/issue", {
    method: "POST",
    body: {id: "MC-295859"},
});
</script>

<template>
<div>
    {{data}}
</div>
</template>

<style scoped>

</style>