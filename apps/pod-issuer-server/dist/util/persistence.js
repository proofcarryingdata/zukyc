"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGovUser = getGovUser;
const kv_1 = require("@vercel/kv");
async function getGovUser(email) {
    return (await kv_1.kv.get(email)) ?? undefined;
}
