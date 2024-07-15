"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.getGovUser = getGovUser;
const kv_1 = require("@vercel/kv");
function getUserByEmail(email) {
    // In practice, look up the user in the database
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length != 2) {
        return null;
    }
    return {
        firstName: names[0],
        lastName: names[1]
    };
}
async function getGovUser(email) {
    return (await kv_1.kv.get(email)) ?? undefined;
}
