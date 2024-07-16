"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pod_1 = require("@pcd/pod");
const gov_1 = require("../stores/gov");
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
}), async (req, res) => {
    const email = req.auth?.email;
    if (!email) {
        res.status(401).send("Unauthorized");
    }
    const inputs = req.body;
    if (!inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // We already issued ID POD for this user, return the POD
    const pod = await (0, gov_1.getIDPODByEmail)(email);
    if (pod !== null) {
        res.status(200).json({ pod });
        return;
    }
    const user = (0, gov_1.getGovUserByEmail)(email);
    if (user === null) {
        res.status(404).send("User not found");
        return;
    }
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            idNumber: { type: "string", value: user.idNumber },
            firstName: { type: "string", value: user.firstName },
            lastName: { type: "string", value: user.lastName },
            age: { type: "int", value: BigInt(user.age) },
            owner: {
                type: "cryptographic",
                value: BigInt(inputs.semaphoreCommitment)
            }
        }, process.env.GOV_EDDSA_PRIVATE_KEY);
        const serializedPOD = pod.serialize();
        await (0, gov_1.saveIDPOD)(email, serializedPOD);
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issue ID POD");
    }
});
exports.default = gov;
