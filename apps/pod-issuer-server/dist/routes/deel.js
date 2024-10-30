"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const pod_1 = require("@pcd/pod");
const deel_1 = require("../stores/deel");
const loginHelper_1 = require("./util/loginHelper");
const shared_1 = require("../stores/shared");
const deel = express_1.default.Router();
deel.post("/login", (req, res) => {
    (0, loginHelper_1.handleLogin)(req, res, process.env.DEEL_JWT_SECRET_KEY);
});
deel.post("/issue", (0, express_jwt_1.expressjwt)({
    secret: process.env.DEEL_JWT_SECRET_KEY,
    algorithms: ["HS512"]
}), async (req, res) => {
    const email = req.auth?.email;
    if (!email) {
        res.status(401).send("Unauthorized");
        return;
    }
    // In practice, the user should have to prove that they
    // own the semaphore identity secret corresponding to this
    // semaphore identity commiment.
    const inputs = req.body;
    if (!inputs.semaphorePublicKey) {
        res.status(400).send("Missing query parameter");
        return;
    }
    try {
        if (!(0, shared_1.checkSemaphorePublicKey)(email, inputs.semaphorePublicKey)) {
            res
                .status(400)
                .send("Semaphore commitment does not match what is on the record.");
            return;
        }
        const user = await (0, deel_1.getDeelUserByEmail)(email);
        if (user === null) {
            res.status(404).send("User not found");
            return;
        }
        // Issue a paystub POD
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            firstName: { type: "string", value: user.firstName },
            lastName: { type: "string", value: user.lastName },
            currentEmployer: { type: "string", value: "ZooPark" },
            startDate: { type: "int", value: user.startDate },
            issueDate: { type: "int", value: BigInt(new Date().getTime()) },
            annualSalary: { type: "int", value: BigInt(user.annualSalary) },
            socialSecurityNumber: {
                type: "string",
                value: user.socialSecurityNumber
            },
            owner: {
                type: "eddsa_pubkey",
                value: inputs.semaphorePublicKey
            }
        }, process.env.DEEL_EDDSA_PRIVATE_KEY);
        const jsonPOD = pod.toJSON();
        const serializedPOD = JSON.stringify(jsonPOD, null, 2);
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issuing Paystub POD: " + e);
    }
});
exports.default = deel;
