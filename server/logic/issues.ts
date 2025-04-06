import {getToken} from "~/server/logic/auth";
import {ADFDoc} from "~/components/adf/types";
import {CACHE_MINUTES, PRIVATE_ISSUE_API, PUBLIC_ISSUE_API} from "~/server/util/constants";

export const getIssueDetails = defineCachedFunction(async (id: string):
    Promise<[PrivateIssueJSON, PublicIssueJSON, AttachmentRequest | null]> =>
{
    const token = await getToken();

    const [issueAuth, issueUnAuth]: [PrivateIssueJSON, PublicIssueJSON] = await Promise.all((await Promise.all([
        fetch(PRIVATE_ISSUE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `customer.account.session.token=${token}`
            },
            body: JSON.stringify({
                options: {
                    reqDetails: {key: id, portalId: 2},
                    portalId: 2
                },
                models: ["reqDetails"],
            }),
            signal: AbortSignal.timeout(30 * 1000)
        }),
        fetch(PUBLIC_ISSUE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                advanced: true,
                project: "MC",
                startAt: 0,
                maxResults: 1,
                search: `key = "${id}"`
            }),
            signal: AbortSignal.timeout(30 * 1000)
        })
    ])).map(res => res.json())) as [PrivateIssueJSON, PublicIssueJSON];

    const attachmentIds = [];

    for (const fileSet of issueAuth.reqDetails.readFileMediaCredentials.tokensWithFiles) {
        for (const file of fileSet.files) {
            attachmentIds.push({type: "file", id: file.attachmentMediaApiId});
        }
    }

    if (issueAuth.reqDetails.readFileMediaCredentials.tokensWithFiles.length === 0) {
        return [issueAuth, issueUnAuth, null];
    }

    const attachments: AttachmentRequest = await (await fetch("https://api.media.atlassian.com/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${issueAuth.reqDetails.readFileMediaCredentials.tokensWithFiles[0].token}`,
            "x-client-id": issueAuth.reqDetails.readFileMediaCredentials.clientId,
        },
        body: JSON.stringify({
            descriptors: attachmentIds
        })
    })).json()

    return [issueAuth, issueUnAuth, attachments];
}, {
    maxAge: CACHE_MINUTES * 60,
    name: 'issue',
    getKey(id: string) {
        return id
    }
})

type PublicIssueJSON = {
    total: number; // number of results returned
    issues: {
        key: string;
        renderedFields: Record<"description" | string, string>;
        fields: {
            description: ADFDoc;
            customfield_10070: number;
            summary: string;
            resolution: {
                name: string;
            };
            watches: {
                watchCount: number;
            };
            versions: {
                name: string;
                released: boolean;
                releaseDate: string;
            }[];
            fixVersions: {
                name: string;
                released: boolean;
                releaseDate: string;
            }[];
            created: string;
            updated: string;
            status: {
                description: string;
                name: string;
            }
        } & {
            [s: string]: {
                value: string;
            }
        }
    }[];
    names: Record<string, string>;
}

type PrivateIssueJSON = {
    reqDetails: {
        reporter: {
            displayName: string;
            avatarUrl: string;
        },
        key: string;
        issue: {
            summary: string;
            status: string;
            date: string;
            friendlyDate: string;
            activityStream: {
                type: "requester-comment" | "worker-comment";
                date: string;
                author: string;
                avatarUrl: string;
                comment: string;
                rawComment: string;
                adfComment: string;
                friendlyDate: string;
            }[]
        }
        readFileMediaCredentials: {
            clientId: string;
            endpointUrl: string;
            tokensWithFiles: {
                token: string;
                files: {
                    attachmentId: number;
                    attachmentMediaApiId: string;
                }[]
            }[]
        }
    }
}

export type AttachmentRequest = {
    data: {
        items: {
            id: string;
            type: "file";
            details: {
                artifacts: {
                    [a: string]: Artifact
                }
                mediaType: "image" | "video" | "archive" | "doc";
                mimeType: string;
                name: string;
            }
        }[]
    }
}

export type Artifact = {
    cdnUrl?: string;
    url?: string;
    mimeType: string;
}