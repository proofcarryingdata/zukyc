import express, { Request, Response } from "express";
import { POD, PODEntries } from "@pcd/pod";
import {
  DEMO_ID_NUMBER,
  DEMO_FIRSTNAME,
  DEMO_LASTNAME,
  DEMO_DATE_OF_BIRTH
} from "../util/constants";

const gov = express.Router();

// TODO: implement login, authenticate
gov.post("/issue", (req: Request, res: Response) => {
  const inputs: {
    idNumber: string;
    semaphoreCommitment: string;
  } = req.body;

  if (!inputs.idNumber || !inputs.semaphoreCommitment) {
    res.status(400).send("Missing query parameter");
    return;
  }

  if (inputs.idNumber === DEMO_ID_NUMBER) {
    // TODO: check if it is demo user
  } else {
    // In practice, Check database to see if the id number belongs to this user
    res.status(403).send("Invalid ID number");
    return;
  }

  try {
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        idNumber: { type: "string", value: inputs.idNumber },
        firstName: { type: "string", value: DEMO_FIRSTNAME },
        lastName: { type: "string", value: DEMO_LASTNAME },
        dateOfBirth: { type: "string", value: DEMO_DATE_OF_BIRTH },
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

export default gov;
