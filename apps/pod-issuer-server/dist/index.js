"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pod_1 = require("@pcd/pod");
dotenv_1.default.config();
const EDDSA_PRIVATE_KEY = process.env.EDDSA_PRIVATE_KEY ||
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const main = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const port = process.env.PORT || 3003;
    app.get("/", (req, res) => {
        res.send("Zukyc Server");
    });
    app.post("/issue", (req, res) => {
        const inputs = req.body;
        if (!inputs.firstName ||
            !inputs.lastName ||
            !inputs.age ||
            !inputs.semaphoreCommitment) {
            throw new Error("Missing query parameter");
        }
        // TODO: more inputs validation
        try {
            // If valid, issue pods
            // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
            const pod = pod_1.POD.sign({
                firstName: { type: "string", value: inputs.firstName },
                lastName: { type: "string", value: inputs.lastName },
                age: { type: "int", value: BigInt(inputs.age) },
                owner: {
                    type: "cryptographic",
                    value: BigInt(inputs.semaphoreCommitment)
                }
            }, EDDSA_PRIVATE_KEY);
            const serializedPOD = pod.serialize();
            res.status(200).json({ pod: serializedPOD });
        }
        catch (e) {
            console.error(e);
            res.status(500).send("Error issue ID POD");
        }
    });
    app.listen(port, () => {
        console.log(`[server]: Server ready on port ${port}`);
    });
};
main();
