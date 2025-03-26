const env = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    console.log(env.public)
    return;
    return (await fetch("https://report.bugs.mojang.com/jsd-login/v1/authentication/authenticate", {
        body: JSON.stringify({
            email: "",
            password: "",
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    })).headers.get("set-cookie")
})