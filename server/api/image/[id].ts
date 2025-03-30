import {getAttachment} from "~/server/attachment";

export default defineEventHandler((event) => {
    return getAttachment(event.context.params?.id!);
})