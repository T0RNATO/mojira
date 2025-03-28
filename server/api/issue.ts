import {getIssueDetails} from "~/server/issue";

export default defineEventHandler(async (ev): Promise<Issue> => {
    const body = await readBody(ev);
    const [{reqDetails: auth}, unauthReq, attachments] = await getIssueDetails(body.id);
    const unauth = unauthReq.issues[0];

    return {
        key: auth.key,
        title: auth.issue.summary,
        status: unauth.fields.status.name,
        resolution: unauth.fields.resolution,
        created: auth.issue.friendlyDate,
        updated: unauth.renderedFields.updated,
        votes: unauth.fields.customfield_10070,
        watchers: unauth.fields.watches.watchCount,
        description: unauth.renderedFields.description,
        mojangPriority: unauth.fields?.customfield_10049?.value || null,
        confirmation: unauth.fields.customfield_10054.value,
        affectsVersions: unauth.fields.versions,
        attachments: attachments ? attachments.data.items.map(att => {
            switch (att.details.mediaType) {
                case "image": {
                    return {
                        name: att.details.name,
                        id: att.id,
                        type: att.details.mediaType,
                        url: att.details.artifacts["image.jpg"].cdnUrl
                    }
                }
                case "video": {
                    return {
                        name: att.details.name,
                        id: att.id,
                        type: att.details.mediaType,
                        url: att.details.artifacts["video_640.mp4"].cdnUrl
                    }
                }
                case "archive": {
                    return {
                        name: att.details.name,
                        id: att.id,
                        type: "archive",
                        url: "Unsupported"
                    }
                }
                default: {
                    throw Error("Unknown media type " + att.details.mediaType);
                }
            }
        }): null,
        reporter: auth.reporter,
        comments: auth.issue.activityStream.filter(item => item.type === "requester-comment")
    }
})

export type Issue = {
    key: string;
    title: string;
    status: string;
    resolution: {
        name: string;
    };
    created: string;
    updated: string;
    votes: number;
    watchers: number;
    description: string;
    reporter: {
        displayName: string;
        avatarUrl: string;
    }
    comments: {
        date: string;
        author: string;
        avatarUrl: string;
        comment: string;
        rawComment: string;
        friendlyDate: string;
    }[]
    mojangPriority: string | null;
    confirmation: string | null;
    affectsVersions: {
        name: string;
        released: boolean;
        releaseDate: string;
    }[];
    attachments: {
        id: string;
        url: string;
        name: string;
        type: "image" | "video" | "archive";
    }[] | null;
}