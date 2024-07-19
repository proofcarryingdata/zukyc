"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveIDPOD = exports.getIDPODByEmail = exports.getGovUserByEmail = void 0;
const lodash_1 = __importDefault(require("lodash"));
const shared_1 = require("./shared");
async function getGovUserByEmail(email) {
    // randomly generate GovUser fields
    // In practice, look up the user in the database
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length < 2) {
        return null;
    }
    const dateOfBirth = shared_1.chance.birthday({ type: "adult" });
    const idNumber = shared_1.chance.string({ pool: "0123456789", length: 7 });
    const ssn = await (0, shared_1.getSSNByEmail)(email);
    return {
        email,
        firstName: lodash_1.default.upperFirst(names[0]),
        lastName: lodash_1.default.upperFirst(names[1]),
        dateOfBirth: BigInt(dateOfBirth.getTime()),
        idNumber: `G${idNumber}`,
        socialSecurityNumber: ssn
    };
}
exports.getGovUserByEmail = getGovUserByEmail;
async function getIDPODByEmail(email) {
    return await shared_1.podIssuerKV.hget(email, "idPOD");
}
exports.getIDPODByEmail = getIDPODByEmail;
async function saveIDPOD(email, serializedPOD) {
    await shared_1.podIssuerKV.hset(email, { idPOD: serializedPOD });
}
exports.saveIDPOD = saveIDPOD;
