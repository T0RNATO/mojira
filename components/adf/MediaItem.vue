<script setup lang="ts">
import type {Issue} from "~/server/api/issue";
import type {Media} from "~/components/adf/types";

const props = defineProps<{
    media: Media
    att: Issue["attachments"]
}>()

if (!props.att) {
    throw Error("Attempting to render media attachment but no attachments found");
}

const attachment = props.att[props.media.attrs.id];
console.log(attachment);
</script>

<template>
<video v-if="attachment.type === 'video'" :src="attachment.url" controls="controls" class="inline-block w-80"/>
<img v-else-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name">
<div v-else-if="attachment.type === 'archive'" class="window">File Download: <span class="rounded-sm bg-black/20">{{attachment.name}}</span> (Unsupported)</div>
<div v-else>Unsupported attachment type "{{attachment.type}}": <a :href="attachment.url">{{attachment.name}}</a>.</div>
</template>

<style scoped>

</style>