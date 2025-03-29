<script setup lang="ts">
import type {ADFDoc} from "~/components/adf/types";
import AdfNode from "~/components/adf/Node.vue";
import type {Issue} from "~/server/api/issue";

defineProps<{
    doc: ADFDoc;
    att: Issue["attachments"]
}>();
</script>

<template>
    <AdfNode v-for="node in doc.content" :node="node" :att="att"/>
</template>

<style scoped>

</style>