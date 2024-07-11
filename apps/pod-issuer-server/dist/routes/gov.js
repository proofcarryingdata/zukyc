"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pod_1 = require("@pcd/pod");
const constants_1 = require("../util/constants");
const gov = express_1.default.Router();
// TODO: implement login, authenticate
gov.post("/issue", (req, res) => {
    const inputs = req.body;
    if (!inputs.idNumber || !inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
    }
    if (inputs.idNumber === constants_1.DEMO_ID_NUMBER) {
        // TODO: check if it is demo user
    }
    else {
        // In practice, Check database to see if the id number belongs to this user
        res.status(403).send("Invalid ID number");
    }
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            idNumber: { type: "string", value: inputs.idNumber },
            firstName: { type: "string", value: constants_1.DEMO_FIRSTNAME },
            lastName: { type: "string", value: constants_1.DEMO_LASTNAME },
            dateOfBirth: { type: "string", value: constants_1.DEMO_DATE_OF_BIRTH },
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
