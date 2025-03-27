import {getToken} from "~/server/log_in";

export default defineEventHandler(async () => {
    return getToken();
})