"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSemaphorePublicKey = exports.getSSNByEmail = exports.podIssuerKV = exports.chance = void 0;
const chance_1 = __importDefault(require("chance"));
const kv_1 = require("@vercel/kv");
exports.chance = new chance_1.default();
exports.podIssuerKV = (0, kv_1.createClient)({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
    automaticDeserialization: false
});
async function getSSNByEmail(email) {
    // randomly generate SSN
    // In practice, look it up in the database
    let ssn = await exports.podIssuerKV.hget(email, "ssn");
    if (!ssn) {
        ssn = exports.chance.ssn();
    }
    await exports.podIssuerKV.hset(email, { ssn: ssn });
    return ssn;
}
exports.getSSNByEmail = getSSNByEmail;
async function checkSemaphorePublicKey(email, semaphorePublicKey) {
    const savedPublicKey = await exports.podIssuerKV.hget(email, "semaphorePublicKey");
    if (savedPublicKey === null) {
        await exports.podIssuerKV.hset(email, { semaphorePublicKey: semaphorePublicKey });
        return true;
    }
    return savedPublicKey === semaphorePublicKey;
}
exports.checkSemaphorePublicKey = checkSemaphorePublicKey;
