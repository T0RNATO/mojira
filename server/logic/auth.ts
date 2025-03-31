import {AUTH_URL, CACHE_MINUTES} from "~/server/util/constants";

const env = useRuntimeConfig();

export const getToken: (refresh?: boolean) => Promise<string | void> = defineCachedFunction(async (refresh: boolean = false): Promise<string | void> => {
    const req = await fetch(AUTH_URL, {
        body: JSON.stringify({
            email: env.email,
            password: env.password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    })
    return parseCookie(req);
}, {
    name: 'token',
    maxAge: CACHE_MINUTES * 60,
    shouldBypassCache: refresh => refresh || false,
})

function err(req: Response) {
    (async () => {
        console.error("Failed to fetch credentials.", req.status, await req.text())
    })()
}

function parseCookie(req: Response): string | void {
    const cookie = req.headers.get("set-cookie");
    if (!cookie) {
        return err(req);
    }
    const c = Object.fromEntries(cookie.split("; ").map(section => section.split("=")));
    if (!("customer.account.session.token" in c)) {
        return err(req);
    }
    return c["customer.account.session.token"];
}
