import type {AttachmentRequest} from "~/server/logic/issues";
import {ATTACHMENT_URL, CACHE_MINUTES} from "~/server/util/constants";

const attachments: Record<string, {token: string, clientId: string, url: string, removeAt: number}> = {};

export async function getAttachment(id: string): Promise<Blob | null> {
    const now = Date.now()
    for (const [id, att] of Object.entries(attachments)) {
        if (att.removeAt < now) {
            delete attachments[id];
        }
    }
    if (!(id in attachments)) return null;
    const {token, clientId, url} = attachments[id];
    const req = await fetch(ATTACHMENT_URL + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "x-client-id": clientId,
        }
    })
    return await req.blob();
}

export function processAttachment(att: AttachmentRequest["data"]["items"][number], artifact: string, token: string, clientId: string): string {
    attachments[att.id] = {
        token,
        clientId,
        url: att.details.artifacts[artifact].url!,
        removeAt: Date.now() + CACHE_MINUTES * 60 * 1000
    }
    return "/api/image/" + att.id;
}