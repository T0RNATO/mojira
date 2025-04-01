<script setup lang="ts">
import type {Issue} from "~/server/api/issue";
import type {Media} from "~/components/adf/types";
const props = defineProps<{
    media: Media
    att: Issue["attachments"]
    gallery?: boolean
}>()

defineEmits(['open']);

if (!props.att) {
    throw Error("Attempting to render media attachment but no attachments found");
}

const attachment = computed(() => props.att![props.media.attrs.id]);

const doc = ref('');

watch(attachment, (value) => {
    if (value.type === "doc") {
        fetch(value.url).then(res => res.text().then(d => {
            doc.value = d;
        }))
    }
}, {
    immediate: true,
})

const videoPlayerVisible = ref(false);
</script>

<template>
    <div v-if="attachment.type === 'video'" class="relative w-80" @click="videoPlayerVisible = true">
        <video :src="attachment.url" class="inline-block w-full align-baseline" :controls="videoPlayerVisible ? 'controls' : false" @blur="videoPlayerVisible = false"/>
        <img class="absolute top-1/2 left-1/2 -translate-1/2 w-16 h-16 rotate-90 select-none" draggable="false" src="/play_button.svg" v-if="!videoPlayerVisible" alt="Play Button">
    </div>
    <img v-else-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" class="inline-block w-80 align-baseline" @click="$emit('open')">
    <div v-else-if="attachment.type === 'archive'" class="window">File Download: <span class="rounded-sm bg-black/20">{{attachment.name}}</span> (Unsupported)</div>
    <div v-else-if="attachment.type === 'doc'" @click="$emit('open')" class="relative inline-block w-80 h-60 p-4 bg-c1 rounded-lg">
        <pre :class="['h-full overflow-auto', {'overflow-hidden': !gallery}]">{{doc}}</pre>
        <div class="absolute left-0 bottom-0 w-full bg-c3 rounded-b-lg p-4">{{attachment.name}}</div>
    </div>
    <div v-else>Unsupported attachment type "{{attachment.type}}": <a :href="attachment.url">{{attachment.name}}</a>.</div>
</template>