import {getIssueDetails} from "~/server/issue";
import {ADFDoc} from "~/components/adf/types";
import {getToken} from "~/server/log_in";

export default defineEventHandler(async (ev): Promise<Issue> => {
    const body = await readBody(ev);
    const [{reqDetails: auth}, unauthReq, attachments] = await getIssueDetails(body.id);
    const unauth = unauthReq.issues[0];

    console.log(await getToken());

    return {
        key: auth.key,
        title: auth.issue.summary,
        status: unauth.fields.status.name,
        resolution: unauth.fields.resolution,
        created: auth.issue.friendlyDate,
        updated: unauth.renderedFields.updated,
        votes: unauth.fields.customfield_10070,
        watchers: unauth.fields.watches.watchCount,
        description: unauth.fields.description,
        mojangPriority: unauth.fields?.customfield_10049?.value || null,
        confirmation: unauth.fields.customfield_10054.value,
        affectsVersions: unauth.fields.versions,
        attachments: attachments ? Object.fromEntries(attachments.data.items.map(att => {
            switch (att.details.mediaType) {
                case "image": {
                    return [att.id, {
                        type: "image",
                        name: att.details.name,
                        url: att.details.artifacts["image.jpg"]?.cdnUrl || 'https://media-cdn.atlassian.com/eu-central-1/v1/cdn' + att.details.artifacts["image.jpg"].url
                    }]
                }
                case "video": {
                    return [att.id, {
                        type: "video",
                        name: att.details.name,
                        url: att.details.artifacts["video_640.mp4"].cdnUrl
                    }]
                }
                case "archive": {
                    return [att.id, {
                        type: "archive",
                        name: att.details.name,
                        url: "Unsupported"
                    }]
                }
                default: {
                    throw Error("Unknown media type " + att.details.mediaType);
                }
            }
        })): null,
        reporter: auth.reporter,
        comments: auth.issue.activityStream.filter(item => item.type === "requester-comment" || item.type === "worker-comment")
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
    description: ADFDoc;
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
        adfComment: string;
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
        [id: string]: {
            url: string;
            name: string;
            type: "image" | "video" | "archive";
        }
    } | null;
}