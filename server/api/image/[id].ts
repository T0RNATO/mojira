import {getAttachment} from "~/server/logic/attachments";

export default defineEventHandler((event) => {
    return getAttachment(event.context.params?.id!);
})