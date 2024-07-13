"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pod_1 = require("@pcd/pod");
const debug = express_1.default.Router();
debug.post("/id/issue", (req, res) => {
    const inputs = req.body;
    if (!inputs.idNumber ||
        !inputs.firstName ||
        !inputs.lastName ||
        !inputs.age ||
        !inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // TODO: check id number format correct
    // TODO: DOB, check in range
    // TODO: check semaphoreCommitment correct
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            idNumber: { type: "string", value: inputs.idNumber },
            firstName: { type: "string", value: inputs.firstName },
            lastName: { type: "string", value: inputs.lastName },
            age: { type: "int", value: BigInt(inputs.age) },
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
debug.post("/paystub/issue", (req, res) => {
    const inputs = req.body;
    if (!inputs.firstName ||
        !inputs.lastName ||
        !inputs.currentEmployer ||
        !inputs.startDate ||
        !inputs.annualSalary ||
        !inputs.semaphoreCommitment) {
        res.status(400).send("Missing query parameter");
        return;
    }
    // TODO: check startDate in range
    // TODO: check annual salary is valid
    // TODO: check semaphoreCommitment correct
    try {
        // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
        const pod = pod_1.POD.sign({
            firstName: { type: "string", value: inputs.firstName },
            lastName: { type: "string", value: inputs.lastName },
            currentEmployer: { type: "string", value: inputs.currentEmployer },
            startDate: { type: "string", value: inputs.startDate },
            annualSalary: { type: "int", value: BigInt(inputs.annualSalary) },
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
        res.status(500).send("Error issue Paystub POD");
    }
});
exports.default = debug;
