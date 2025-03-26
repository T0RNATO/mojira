<script setup lang="ts">
async function awd() {
    const awd = await $fetch('/api/creds');
    console.log(awd);
}
</script>

<template>
    <button @click="awd">hi</button>
</template>

<style scoped>

</style>