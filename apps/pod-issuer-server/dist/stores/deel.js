"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePaystubPOD = exports.getPaystubPODByEmail = exports.getDeelUserByEmail = void 0;
const chance_1 = __importDefault(require("chance"));
const lodash_1 = __importDefault(require("lodash"));
const kv_1 = require("@vercel/kv");
const podIssuerKV = (0, kv_1.createClient)({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
    automaticDeserialization: false
});
const chance = new chance_1.default();
function getDeelUserByEmail(email) {
    // randomly generate DeelUser fields
    // In practice, look up the user in the database
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length < 2) {
        return null;
    }
    const startDate = chance.birthday({
        string: true,
        type: "child"
    });
    const annualSalary = chance.integer({ min: 20000, max: 1000000 });
    return {
        email,
        firstName: lodash_1.default.upperFirst(names[0]),
        lastName: lodash_1.default.upperFirst(names[1]),
        startDate,
        annualSalary
    };
}
exports.getDeelUserByEmail = getDeelUserByEmail;
async function getPaystubPODByEmail(email) {
    const key = `paystub-${email}`;
    return await podIssuerKV.get(key);
}
exports.getPaystubPODByEmail = getPaystubPODByEmail;
async function savePaystubPOD(email, serializedPOD) {
    await podIssuerKV.set(`paystub-${email}`, serializedPOD);
}
exports.savePaystubPOD = savePaystubPOD;
