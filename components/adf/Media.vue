<script setup lang="ts">
import type {MediaNode} from "~/components/adf/types";
import type {Issue} from "~/server/api/issue";
import MediaItem from "~/components/adf/MediaItem.vue";

defineProps<{
    node: MediaNode
    att: Issue["attachments"]
}>();

</script>

<template>
<template v-for="media in node.content">
    <MediaItem :media="media" :att="att"/>
</template>
</template>

<style scoped>

</style>