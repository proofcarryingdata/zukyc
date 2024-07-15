"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pod_1 = require("@pcd/pod");
const constants_1 = require("../util/constants");
const deel = express_1.default.Router();
deel.post("/login", (req, res) => {
    const inputs = req.body;
    if (!inputs.email || !inputs.password) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // In practice, get user information from database by email,
    // Here for demo purposes, we'll allow any email with @zoo.com domain
    if (!inputs.email.endsWith("@zoo.com")) {
        res.status(401).send("Invalid email or password");
        return;
    }
    // In practice, check if the encrypted password match
    // This is just for demo purposes
    if (!inputs.password.startsWith("zoo")) {
        res.status(401).send("Invalid email or password");
        return;
    }
    // Signing JWT, valid for 1 hour
    const token = jsonwebtoken_1.default.sign({ email: inputs.email }, process.env.DEEL_EDDSA_PRIVATE_KEY, { algorithm: "HS512", expiresIn: "1h" });
    res.send(token);
});
deel.post("/issue", (0, express_jwt_1.expressjwt)({
    secret: process.env.DEEL_EDDSA_PRIVATE_KEY,
    algorithms: ["HS512"]
}), (req, res) => {
    const inputs = req.body;
    if (!inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // In practice, look up the user information in the database
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            firstName: { type: "string", value: constants_1.DEMO_FIRSTNAME },
            lastName: { type: "string", value: constants_1.DEMO_LASTNAME },
            currentEmployer: { type: "string", value: constants_1.DEMO_CURRENT_EMPLOYER },
            startDate: { type: "string", value: constants_1.DEMO_START_DATE },
            annualSalary: { type: "int", value: BigInt(constants_1.DEMO_ANNUAL_SALARY) },
            owner: {
                type: "cryptographic",
                value: BigInt(inputs.semaphoreCommitment)
            }
        }, process.env.DEEL_EDDSA_PRIVATE_KEY);
        const serializedPOD = pod.serialize();
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issue ID POD");
    }
});
exports.default = deel;
