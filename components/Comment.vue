<script setup lang="ts">
import type {Issue} from "~/server/api/issue";
import Render from "~/components/adf/Render.vue";

const props = defineProps<{
    comment: Issue["comments"][number],
    attachments: Issue["attachments"]
}>();
</script>

<template>
    <img :src="comment.avatarUrl" alt="Avatar" class="w-4 inline-block mr-2">
    <span class="font-bold mr-2">{{comment.author}}</span>
    <span class="text-slate-400">{{comment.friendlyDate}}</span>
    <br/>
    <Render :doc="JSON.parse(comment.adfComment)" :att="attachments"/>
</template>

<style scoped>

</style>