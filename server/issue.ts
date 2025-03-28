import {getToken} from "~/server/log_in";

export const getIssueDetails = defineCachedFunction(async (id: string): Promise<IssueRequest> => {
    return await (await fetch("https://report.bugs.mojang.com/rest/servicedesk/1/customer/models\n", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `customer.account.session.token=${await getToken()}`
        },
        body: JSON.stringify({
            options: {
                reqDetails: {key: id, portalId: 2},
                portalId: 2
            },
            models: ["reqDetails"],
        })
    })).json()
}, {
    maxAge: 10 * 60,
    name: 'issue',
    getKey(id: string) {
        return id
    }
})

type IssueRequest = {
    total: number; // number of results returned
    issues: Issue[];
    names: Record<string, string>;
}

type Issue = {
    key: string;
    renderedFields: Record<"description" | string, string | null>;
    fields: {
        summary: string;
        watches: {
            watchCount: number;
        };
        versions: {
           name: string;
           released: boolean;
           releaseDate: string;
        }[];
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
}