"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pod_1 = require("@pcd/pod");
const gov = express_1.default.Router();
gov.post("/login", (req, res) => {
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
    const token = jsonwebtoken_1.default.sign({ email: inputs.email }, process.env.GOV_EDDSA_PRIVATE_KEY, { algorithm: "HS512", expiresIn: "1h" });
    res.send(token);
});
gov.post("/issue", (0, express_jwt_1.expressjwt)({
    secret: process.env.GOV_EDDSA_PRIVATE_KEY,
    algorithms: ["HS512"]
}), (req, res) => {
    const inputs = req.body;
    if (!inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // TODO: randomly generate first name, last name
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            idNumber: { type: "string", value: "G1234567" },
            firstName: { type: "string", value: "gerry" },
            lastName: { type: "string", value: "raffy" },
            age: { type: "int", value: BigInt(18) },
            owner: {
                type: "cryptographic",
                value: BigInt(inputs.semaphoreCommitment)
            }
        }, process.env.GOV_EDDSA_PRIVATE_KEY);
        const serializedPOD = pod.serialize();
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issue ID POD");
    }
});
exports.default = gov;
