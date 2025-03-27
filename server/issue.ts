export const getIssueDetails = defineCachedFunction(async (id: string) => {
    console.log("this ran")
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