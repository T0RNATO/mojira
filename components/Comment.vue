<script setup lang="ts">
import type {Issue} from "~/server/api/issue";

const props = defineProps<{
    comment: Issue["comments"][number],
    attachments: Issue["attachments"]
}>();

const commentSections = computed(() => {
    const out: ({
        type: "string";
        value: string;
    } | {
        type: Issue["attachments"][number]["type"]
        url: string
    })[] = [];
    const sections = props.comment.rawComment.split("!");
    for (const section of sections) {
        if (!section.includes("|")) {
            if (section.trim()) {
                out.push({type: "string", value: section})
            }
        } else {
            if (props.attachments === null) {
                throw Error("Missing attachment data");
            }
            const filename = section.split("|")[0];
            const match = filename.match(/.* \((.*)\)\..*/);
            if (match) {
                const id = match[1];
                const {type, url} = props.attachments.find(att => att.id === id)
                out.push({type, url});
            } else {
                const {type, url} = props.attachments.find(att => att.name === filename);
                out.push({type, url});
            }
        }
    }
    return out;
});
</script>

<template>
    <img :src="comment.avatarUrl" alt="Avatar" class="w-4 inline-block mr-2">
    <span class="font-bold mr-2">{{comment.author}}</span>
    <span class="text-slate-400">{{comment.friendlyDate}}</span>
    <br/>
    <template v-for="section in commentSections">
        <p v-if="section.type === 'string'" class="mb-2">{{section.value}}</p>
        <video v-else-if="section.type === 'video'" controls="controls" :src="section.url" class="w-100 inline-block"/>
        <img v-else-if="section.type === 'image'" :src="section.url" class="w-100 inline-block" alt=""/>
    </template>
</template>

<style scoped>

</style>