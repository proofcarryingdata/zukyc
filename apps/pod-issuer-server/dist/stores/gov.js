"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGovUserByEmail = getGovUserByEmail;
exports.getIDPODByEmail = getIDPODByEmail;
exports.saveIDPOD = saveIDPOD;
const chance_1 = __importDefault(require("chance"));
const lodash_1 = __importDefault(require("lodash"));
const kv_1 = require("@vercel/kv");
const podIssuerKV = (0, kv_1.createClient)({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
    automaticDeserialization: false
});
const chance = new chance_1.default();
function getGovUserByEmail(email) {
    // randomly generate GovUser fields
    // In practice, look up the user in the database
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length < 1) {
        return null;
    }
    if (names.length === 1) {
        const lastName = chance.last();
        names.push(lastName);
    }
    const age = chance.age({ type: "adult" });
    const idNumber = chance.string({ pool: "0123456789", length: 7 });
    return {
        email,
        firstName: lodash_1.default.upperFirst(names[0]),
        lastName: lodash_1.default.upperFirst(names[1]),
        age,
        idNumber: `G${idNumber}`
    };
}
async function getIDPODByEmail(email) {
    const key = `id-${email}`;
    return await podIssuerKV.get(key);
}
async function saveIDPOD(email, serializedPOD) {
    await podIssuerKV.set(`id-${email}`, serializedPOD);
}
