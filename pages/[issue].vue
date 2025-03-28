<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch("/api/issue", {
    method: "POST",
    body: {id: route.params.issue},
});

const issue = computed(() => data.value!.issues[0]);

const fieldsWithValues = computed(() =>
    Object.keys(data.value!.names).filter(field =>
        (issue.value.renderedFields[field] || issue.value.fields[field]?.value) &&
        field !== "description"
    )
);
</script>

<template>
<div v-if="data && data.total > 0">
    <h1 class="inline">{{route.params.issue}}</h1>
    <span class="text-2xl dark:text-slate-300">: {{issue.fields.summary}}</span>
    <hr>
    <div class="float-right dark:text-white dark:bg-slate-700 bg-slate-200 p-4 rounded-md">
        <div v-for="field in fieldsWithValues">
            <span class="font-semibold">{{data.names[field]}}</span>: {{issue.renderedFields[field] || issue.fields[field]?.value}}
        </div>
        <a href="#" class="italic text-slate-400 dark:slate-800">Empty Fields Hidden...</a>
    </div>
    <div class="prose prose-slate max-w-none dark:prose-invert" v-html="issue.renderedFields.description"></div>
</div>
<div v-else>
    Failed to find issue {{route.params.issue}}, or found multiple possible issues.
</div>
</template>

<style scoped>

</style>