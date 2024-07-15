"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.getIDPODByEmail = getIDPODByEmail;
exports.saveIDPOD = saveIDPOD;
exports.getPaystubPODByEmail = getPaystubPODByEmail;
exports.savePaystubPOD = savePaystubPOD;
const kv_1 = require("@vercel/kv");
const podIssuerKV = (0, kv_1.createClient)({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
    automaticDeserialization: false
});
function getUserByEmail(email) {
    // In practice, look up the user in the database
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length != 2) {
        return null;
    }
    return {
        email,
        firstName: names[0],
        lastName: names[1]
    };
}
async function getIDPODByEmail(email) {
    const key = `id-${email}`;
    return await podIssuerKV.get(key);
}
async function saveIDPOD(email, serializedPOD) {
    await podIssuerKV.set(`id-${email}`, serializedPOD);
}
async function getPaystubPODByEmail(email) {
    const key = `paystub-${email}`;
    return await podIssuerKV.get(key);
}
async function savePaystubPOD(email, serializedPOD) {
    await podIssuerKV.set(`paystub-${email}`, serializedPOD);
}
