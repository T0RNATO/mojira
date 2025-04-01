<script setup lang="ts">
import type {MediaNode} from "~/components/adf/types";
import type {Issue} from "~/server/api/issue";
import MediaItem from "~/components/adf/MediaItem.vue";

const props = defineProps<{
    node: MediaNode
    att: Issue["attachments"]
}>();

function modal(ev: KeyboardEvent) {
    if (modalOpen.value) {
        switch (ev.key) {
            case "Escape": {
                modalOpen.value = false;
                break;
            }
            case "ArrowLeft": {
                galleryIndex.value--;
                break;
            }
            case "ArrowRight": {
                galleryIndex.value++;
                console.log(galleryIndex.value);
                break;
            }
        }
    }
    if (galleryIndex.value === props.node.content.length) {
        galleryIndex.value = 0;
    }
    if (galleryIndex.value === -1) {
        galleryIndex.value = props.node.content.length - 1;
    }
}

onMounted(() => {
    document.body.addEventListener("keyup", modal);
})
onUnmounted(() => {
    document.body.removeEventListener("keyup", modal);
})

const galleryIndex = ref(0);
const modalOpen = ref(false);
</script>

<template>
    <div v-if="node.type === 'mediaGroup'" class="flex flex-wrap gap-2">
        <div v-for="(media, i) in node.content">
            <MediaItem :media="media" :att="att" @open="modalOpen = true; galleryIndex = i"/>
        </div>
    </div>
    <div v-else>
        <MediaItem :media="node.content[0]" :att="att" @open="modalOpen = true; galleryIndex = 0"/>
    </div>
    <div class="fixed w-screen h-screen top-0 left-0 bg-black/30 flex items-center justify-center backdrop-blur-xs z-10"
         v-if="modalOpen" @click="modalOpen = false"
    >
        <MediaItem :media="node.content[galleryIndex]" :att="att" :gallery="true" class="!min-w-[80%] !min-h-[80%]" @click.stop/>
    </div>
</template>

<style scoped>

</style>