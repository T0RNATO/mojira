<script setup lang="ts">
import Comment from "~/components/Comment.vue";
import Render from "~/components/adf/Render.vue";
import type {ADFDoc} from "~/components/adf/types";

const route = useRoute();
const { data: issue, status } = await useFetch("/api/issue", {
    method: "POST",
    body: {id: route.params.issue},
});

const affectedVersions = computed(() => {
    const v = issue.value!.affectsVersions.map(v => v.name);
    if (v.length > 5) {
        return [v[0], v[1], "...", v.at(-2), v.at(-1)];
    }
    return v;
})
</script>

<template>
<div v-if="status === 'pending'">
    Loading...
</div>
<div v-else-if="status === 'success' && issue" class="dark:text-slate-300 text-slate-800">
    <h1 class="inline">{{issue.key}}</h1>
    <span class="text-2xl">: {{issue.title}}</span>
    <hr>
    <div class="md:float-right window min-w-1/4">
        <span class="font-semibold mr-2">By:</span><img :src="issue.reporter.avatarUrl" class="w-4 inline-block mr-2" alt="Avatar">{{issue.reporter.displayName}}<br/>
        <span class="font-semibold mr-2">Created:</span>{{issue.created}}<br/>
        <span class="font-semibold mr-2">Last Updated:</span>{{issue.updated}}<br/>
        <span class="font-semibold mr-2">Mojang Priority:</span>{{issue.mojangPriority || "None"}}<br/>
        <span class="font-semibold mr-2">Affected Versions:</span>{{affectedVersions.join(", ")}}<br/>
        <span class="font-semibold mr-2">Confirmation:</span>{{issue.confirmation}}<br/>
        <span class="font-semibold mr-2">Resolution:</span>{{issue?.resolution?.name || "None"}}<br/>
        <span class="font-semibold mr-2">Votes:</span>{{issue.votes || 0}}<br/>
        <span class="font-semibold mr-2">Watchers:</span>{{issue.watchers}}<br/>
    </div>
    <div class="prose prose-slate max-w-none dark:prose-invert">
        <Render :doc="issue.description as ADFDoc" :att="issue.attachments"/>
    </div>
    <h2>Comments</h2>
    <div v-for="comment in issue.comments" class="dark:text-slate-300 window mb-2" v-if="issue.comments.length">
        <Comment :comment="comment" :attachments="issue.attachments"/>
    </div>
    <div v-else>
        This issue has no comments
    </div>
</div>
<div v-else>
    Failed to find issue {{route.params.issue}}, or found multiple possible issues.
</div>
</template>

<style scoped>

</style>