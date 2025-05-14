"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeelUserByEmail = void 0;
const lodash_1 = __importDefault(require("lodash"));
const shared_1 = require("./shared");
async function getDeelUserByEmail(email) {
    // randomly generate DeelUser fields
    // In practice, look up the user in the database
    // const user = await podIssuerKV.hget<string>(email, "deelUser");
    // if (user !== null) {
    //   return jsonBigSerializer.parse(user);
    // }
    const names = email.replace(/@zoo.com$/, "").split(".");
    if (names.length < 2) {
        return null;
    }
    const startDate = shared_1.chance.birthday({
        year: shared_1.chance.year({ min: 2000, max: 2022 })
    });
    const annualSalary = shared_1.chance.integer({ min: 20000, max: 1000000 });
    const ssn = await (0, shared_1.getSSNByEmail)(email);
    const deelUser = {
        email,
        firstName: lodash_1.default.upperFirst(names[0]),
        lastName: lodash_1.default.upperFirst(names[1]),
        startDate: startDate.getTime(),
        annualSalary: BigInt(annualSalary),
        socialSecurityNumber: ssn
    };
    // await podIssuerKV.hset(email, {
    //   deelUser: jsonBigSerializer.stringify(deelUser)
    // });
    return deelUser;
}
exports.getDeelUserByEmail = getDeelUserByEmail;
