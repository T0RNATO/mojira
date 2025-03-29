import {getToken} from "~/server/log_in";
import {ADFDoc} from "~/components/adf/types";

export const getIssueDetails = defineCachedFunction(async (id: string):
    Promise<[AuthenticatedIssueRequest, UnAuthIssueRequest, AttachmentRequest | null]> =>
{
    const token = await getToken();

    // @ts-ignore
    const [issueAuth, issueUnAuth]: [AuthenticatedIssueRequest, UnAuthIssueRequest] = await Promise.all((await Promise.all([
        fetch("https://report.bugs.mojang.com/rest/servicedesk/1/customer/models", {
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
            })
        }),
        fetch("https://bugs.mojang.com/api/jql-search-post", {
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
            })
        })
    ])).map(res => res.json()))

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
    maxAge: 20 * 60,
    name: 'issue',
    getKey(id: string) {
        return id
    }
})

type UnAuthIssueRequest = {
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

type AuthenticatedIssueRequest = {
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
            // fields: {}[];
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

type AttachmentRequest = {
    data: {
        items: {
            id: string;
            type: "file";
            details: {
                artifacts: {
                    [a: string]: Artifact
                }
                mediaType: "image" | "video" | "archive";
                mimeType: string;
                name: string;
            }
        }[]
    }
}

type Artifact = {
    cdnUrl?: string;
    url?: string;
    mimeType: string;
}