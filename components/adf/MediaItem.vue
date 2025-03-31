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

const doc = ref('');

if (attachment.type === "doc") {
    fetch(attachment.url).then(res => res.text().then(d => {
        doc.value = d;
    }))
}

const modalOpen = ref(false);
</script>

<template>
    <video v-if="attachment.type === 'video'" :src="attachment.url" controls="controls" class="inline-block w-80 align-baseline"/>
    <img v-else-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" class="inline-block w-80 align-baseline" @click="modalOpen = true">
    <div v-else-if="attachment.type === 'archive'" class="window">File Download: <span class="rounded-sm bg-black/20">{{attachment.name}}</span> (Unsupported)</div>
    <div v-else-if="attachment.type === 'doc'" @click="modalOpen = true" class="relative inline-block w-80 h-60 p-4 bg-c1 rounded-lg">
        <pre class="overflow-hidden h-50">{{doc}}</pre>
        <div class="absolute left-0 bottom-0 w-full bg-c3 rounded-b-lg p-4">{{attachment.name}}</div>
    </div>
    <div v-else>Unsupported attachment type "{{attachment.type}}": <a :href="attachment.url">{{attachment.name}}</a>.</div>

    <div class="fixed w-screen h-screen top-0 left-0 bg-black/30 flex items-center justify-center backdrop-blur-xs" v-if="modalOpen" @click="modalOpen = false">
        <img v-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" class="max-w-[90%] max-h-[90%] min-w-[70%]" @click.stop>
        <pre v-else-if="attachment.type === 'doc'" class="w-[80%] h-[80%] window overflow-auto" @click.stop>{{doc}}</pre>
    </div>
</template>

<style scoped>

</style>