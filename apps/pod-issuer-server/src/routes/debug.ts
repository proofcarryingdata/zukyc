import express, { Request, Response } from "express";
import { POD, PODEntries } from "@pcd/pod";

const debug = express.Router();

debug.post("/issue", (req: Request, res: Response) => {
  const inputs: {
    idNumber: string;
    firstName: string;
    lastName: string;
    age: string;
    semaphoreCommitment: string;
  } = req.body;

  if (
    !inputs.idNumber ||
    !inputs.firstName ||
    !inputs.lastName ||
    !inputs.age ||
    !inputs.semaphoreCommitment
  ) {
    res.status(400).send("Missing query parameter");
  }

  try {
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        idNumber: { type: "string", value: inputs.idNumber },
        firstName: { type: "string", value: inputs.firstName },
        lastName: { type: "string", value: inputs.lastName },
        age: { type: "int", value: BigInt(inputs.age) },
        owner: {
          type: "cryptographic",
          value: BigInt(inputs.semaphoreCommitment)
        }
      } satisfies PODEntries,
      process.env.GOV_EDDSA_PRIVATE_KEY!
    );
    const serializedPOD = pod.serialize();
    res.status(200).json({ pod: serializedPOD });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error issue ID POD");
  }
});

export default debug;
