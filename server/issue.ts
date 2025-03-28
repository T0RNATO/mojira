export const getIssueDetails = defineCachedFunction(async (id: string): Promise<IssueRequest> => {
    return await (await fetch("https://bugs.mojang.com/api/jql-search-post", {
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