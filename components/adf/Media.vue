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
    <div v-if="node.type === 'mediaGroup'" class="flex flex-wrap gap-2">
        <div v-for="media in node.content">
            <MediaItem :media="media" :att="att"/>
        </div>
    </div>
    <div v-else>
        <MediaItem :media="node.content[0]" :att="att"/>
    </div>
</template>

<style scoped>

</style>