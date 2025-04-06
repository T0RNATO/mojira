<script setup lang="ts">
import type {ADFDoc, ADFMark, ADFNode, MediaNode} from "~/components/adf/types";
import RenderAdf from "~/components/adf/Render.vue";
import Media from "~/components/adf/Media.vue";
import type {Issue} from "~/server/api/issue";

defineProps<{
    node: ADFNode
    att: Issue["attachments"]
}>();

function formatting(node: ADFNode) {
    return {
        'font-bold': hasMark(node, 'strong'),
        'underline': hasMark(node, 'underline'),
        'line-through': hasMark(node, 'strike'),
        'italic': hasMark(node, 'em'),
    }
}

function hasMark(node: ADFNode, mark: string): boolean {
    return node?.marks?.findIndex(m => m.type === mark) > -1;
}

function getMark(node: ADFNode, mark: string): ADFMark {
    return node.marks!.find(m => m.type === mark)!;
}
</script>

<template>
    <p              v-if="node.type === 'paragraph'"><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></p>
    <a         v-else-if="node.type === 'text' && hasMark(node, 'link')" :class="formatting(node)" :href="getMark(node, 'link')?.attrs?.href">{{node.text}}</a>
    <code      v-else-if="node.type === 'text' && hasMark(node, 'code')" :class="formatting(node)">{{node.text}}</code>
    <span      v-else-if="node.type === 'text'" :class="formatting(node)">{{node.text}}</span>
    <span      v-else-if="node.type === 'mention'" class="rounded-sm bg-white/10 font-semibold">{{node.attrs?.text || '@unknown'}}</span>
    <br        v-else-if="node.type === 'hardBreak'"/>
    <hr        v-else-if="node.type === 'rule'"/>
    <Media     v-else-if="node.type === 'mediaSingle' || node.type === 'mediaGroup'" :node="node as MediaNode" :att="att"/>
    <component v-else-if="node.type === 'heading'" :is="'h' + (node.attrs?.level || 1)"><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></component>
    <ol        v-else-if="node.type === 'orderedList'"><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></ol>
    <ul        v-else-if="node.type === 'bulletList'" ><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></ul>
    <li        v-else-if="node.type === 'listItem'"   ><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></li>
    <pre       v-else-if="node.type === 'codeBlock'" class="whitespace-break-spaces"><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></pre>
    <div       v-else-if="node.type === 'expand'">{{node.attrs?.title || ''}}<div class="ml-4"><RenderAdf :att="att" :doc="node as ADFDoc" v-if="node.content"/></div></div> <!--todo-->
    <span      v-else-if="node.type === 'date'">{{new Date(node.attrs.timestamp)}}</span>
    <span      v-else-if="node.type === 'emoji'">{{node.text}}</span>
    <a         v-else-if="node.type === 'inlineCard'" :href="node.attrs?.url">{{node.attrs?.url}}</a>
    <div v-else>{'{{node.type}}'} Node (No Defined Rendering)</div> <!--todo: tables, blockquote, etc. docs: https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/table/-->
</template>

<style scoped>

</style>