import type {AttachmentRequest} from "~/server/issue";
const env = useRuntimeConfig();

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
    const req = await fetch("https://api.media.atlassian.com" + url, {
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
        removeAt: Date.now() + env.cacheMinutes * 60 * 1000
    }
    return "/api/image/" + att.id;
}