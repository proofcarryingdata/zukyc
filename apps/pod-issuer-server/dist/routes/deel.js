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
const deel = express_1.default.Router();
deel.post("/login", (req, res) => {
    (0, loginHelper_1.handleLogin)(req, res, process.env.DEEL_EDDSA_PRIVATE_KEY);
});
deel.post("/issue", (0, express_jwt_1.expressjwt)({
    secret: process.env.DEEL_EDDSA_PRIVATE_KEY,
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
    if (!inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    try {
        // We already issued paystub POD for this user, return the POD
        const podStr = await (0, deel_1.getPaystubPODByEmail)(email);
        if (podStr !== null) {
            const pod = pod_1.POD.deserialize(podStr);
            const owner = pod.content.asEntries().owner.value;
            if (owner !== BigInt(inputs.semaphoreCommitment)) {
                res
                    .status(400)
                    .send("Already issued POD for this user, but Semaphore Commitment doesn't match.");
                return;
            }
            res.status(200).json({ pod: podStr });
            return;
        }
        const user = (0, deel_1.getDeelUserByEmail)(email);
        if (user === null) {
            res.status(404).send("User not found");
            return;
        }
        // In this case, we haven't issued a paystub POD for this user yet,
        // need to issue one and save it for future use.
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            firstName: { type: "string", value: user.firstName },
            lastName: { type: "string", value: user.lastName },
            currentEmployer: { type: "string", value: "ZooPark" },
            startDate: { type: "int", value: user.startDate },
            issueDate: { type: "int", value: BigInt(new Date().getTime()) },
            annualSalary: { type: "int", value: BigInt(user.annualSalary) },
            owner: {
                type: "cryptographic",
                value: BigInt(inputs.semaphoreCommitment)
            }
        }, process.env.DEEL_EDDSA_PRIVATE_KEY);
        const serializedPOD = pod.serialize();
        await (0, deel_1.savePaystubPOD)(email, serializedPOD);
        res.status(200).json({ pod: serializedPOD });
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error issuing Paystub POD: " + e);
    }
});
exports.default = deel;
