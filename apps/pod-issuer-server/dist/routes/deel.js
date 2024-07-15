"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chance_1 = __importDefault(require("chance"));
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pod_1 = require("@pcd/pod");
const persistence_1 = require("../util/persistence");
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
    const pod = await (0, persistence_1.getPaystubPODByEmail)(email);
    if (pod !== null) {
        res.status(200).json({ pod });
        return;
    }
    const user = (0, persistence_1.getUserByEmail)(email);
    if (user === null) {
        res.status(404).send("User not found");
        return;
    }
    // radomly generate these fields
    // In paractice, we can look them up in the database
    const chance = new chance_1.default();
    const startDate = chance.birthday({
        string: true,
        type: "child"
    });
    const annualSalary = chance.integer({ min: 20000, max: 1000000 });
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            firstName: { type: "string", value: user.firstName },
            lastName: { type: "string", value: user.lastName },
            currentEmployer: { type: "string", value: "ZooPark" },
            startDate: { type: "string", value: startDate },
            annualSalary: { type: "int", value: BigInt(annualSalary) },
            owner: {
                type: "cryptographic",
                value: BigInt(inputs.semaphoreCommitment)
            }
        }, process.env.DEEL_EDDSA_PRIVATE_KEY);
        const serializedPOD = pod.serialize();
        await (0, persistence_1.savePaystubPOD)(email, serializedPOD);
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issue ID POD");
    }
});
exports.default = deel;
