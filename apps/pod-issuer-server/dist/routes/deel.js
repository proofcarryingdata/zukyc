"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pod_1 = require("@pcd/pod");
const constants_1 = require("../util/constants");
const deel = express_1.default.Router();
// TODO: implement login, authenticate
deel.post("/issue", (req, res) => {
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
            employer: { type: "string", value: constants_1.DEMO_EMPLOYER },
            startDate: { type: "string", value: constants_1.DEMO_START_DATE },
            endDate: { type: "string", value: constants_1.DEMO_END_DATE },
            paymentFrequency: { type: "string", value: constants_1.DEMO_PAYMENT_FREQUENCY },
            salary: { type: "string", value: constants_1.DEMO_SALARY },
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
