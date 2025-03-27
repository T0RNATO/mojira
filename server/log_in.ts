const env = useRuntimeConfig();

type Cookie = {
    token: string;
    expires: Date;
} | {
   token: null;
   expires: null;
}

const token: Cookie = {
    token: null,
    expires: null
}

export async function getToken() {
    if (token.token && Date.now() < token.expires.getTime()) {
        return token.token;
    }
    await refreshToken()
    return token.token;
}

export async function refreshToken() {
    const req = await fetch("https://report.bugs.mojang.com/jsd-login/v1/authentication/authenticate", {
        body: JSON.stringify({
            email: env.email,
            password: env.password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    })
    parseCookie(req);
}

function err(req: Response) {
    (async () => {
        console.error("Failed to fetch credentials.", req.status, await req.text())
    })()
}

function parseCookie(req: Response): any {
    const cookie = req.headers.get("set-cookie");
    if (!cookie) {
        return err(req);
    }
    const c = Object.fromEntries(cookie.split("; ").map(section => section.split("=")));
    if (!("customer.account.session.token" in c)) {
        return err(req);
    }
    token.token = c["customer.account.session.token"];
    if ("Expires" in c) {
        token.expires = new Date(c.Expires);
    }
    if ("Max-Age" in c) {
        token.expires = new Date(Date.now() + Number(c["Max-Age"]))
    }
}
