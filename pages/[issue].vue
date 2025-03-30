<script setup lang="ts">
import Comment from "~/components/Comment.vue";
import Render from "~/components/adf/Render.vue";
import type {ADFDoc} from "~/components/adf/types";

const route = useRoute();
const { data: issue, status } = await useFetch("/api/issue", {
    method: "POST",
    body: {id: route.params.issue},
});

useHead({
    title: issue.value?.title || "Bug not found"
})

if (issue.value) {
    useSeoMeta({
        ogTitle: issue.value.title,
        ogDescription: `Created: ${issue.value.created}
Votes: ${issue.value.votes || 0}
Resolution: ${issue.value?.resolution?.name || "None"}
Reporter: ${issue.value.reporter.displayName}`,
        ogType: "website",
        ogSiteName: "Bug Viewer",
    })
} else {
    useSeoMeta({
        ogTitle: "Bug not found",
        ogType: "website",
        ogSiteName: "Bug Viewer"
    })
}

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
<div v-else-if="status === 'success' && issue">
    <h1 class="inline">{{issue.key}}</h1>
    <span class="text-2xl">: {{issue.title}}</span>
    <hr>
    <div class="md:float-right window min-w-1/4 border-4 dark:border-slate-800 border-slate-100">
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
    Server Error: {{route.params.issue}} may not exist or may have just failed to parse. Check it out on
    <a :href="'https://bugs.mojang.com/browse/MC/issues/' + route.params.issue">{{'https://bugs.mojang.com/browse/MC/issues/' + route.params.issue}}</a>
    and if you think this is an issue, please <a href="https://github.com/T0RNATO/mojira/issues/new">create an issue</a>, and tell me this issue's ID.
</div>
</template>

<style scoped>

</style>