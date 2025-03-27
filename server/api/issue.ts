import {getIssueDetails} from "~/server/issue";

export default defineEventHandler(async (ev) => {
    const body = await readBody(ev);
    return await getIssueDetails(body.id);
})