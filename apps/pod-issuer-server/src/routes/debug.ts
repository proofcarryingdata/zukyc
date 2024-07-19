import express, { Request, Response } from "express";
import { POD, PODEntries } from "@pcd/pod";

const debug = express.Router();

debug.post("/id/issue", (req: Request, res: Response) => {
  const inputs: {
    idNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    semaphoreCommitment: string;
  } = req.body;

  if (
    !inputs.idNumber ||
    !inputs.firstName ||
    !inputs.lastName ||
    !inputs.dateOfBirth ||
    !inputs.semaphoreCommitment
  ) {
    res.status(400).send("Missing query parameter");
    return;
  }

  if (!/^[A-Z][0-9]{7}$/.test(inputs.idNumber)) {
    res.status(400).send("Invalid ID number format");
    return;
  }

  const dateOfBirth = new Date(inputs.dateOfBirth);
  if (
    isNaN(dateOfBirth.valueOf()) ||
    new Date(inputs.dateOfBirth) > new Date()
  ) {
    res.status(400).send("Invalid date of birth");
    return;
  }

  try {
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        idNumber: { type: "string", value: inputs.idNumber },
        firstName: { type: "string", value: inputs.firstName },
        lastName: { type: "string", value: inputs.lastName },
        dateOfBirth: { type: "int", value: BigInt(dateOfBirth.getTime()) },
        owner: {
          type: "cryptographic",
          value: BigInt(inputs.semaphoreCommitment)
        }
      } satisfies PODEntries,
      process.env.GOV_EDDSA_PRIVATE_KEY as string
    );
    const serializedPOD = pod.serialize();
    res.status(200).json({ pod: serializedPOD });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error issue ID POD: " + e);
  }
});

debug.post("/paystub/issue", (req: Request, res: Response) => {
  const inputs: {
    firstName: string;
    lastName: string;
    currentEmployer: string;
    startDate: string;
    annualSalary: number;
    semaphoreCommitment: string;
  } = req.body;

  if (
    !inputs.firstName ||
    !inputs.lastName ||
    !inputs.currentEmployer ||
    !inputs.startDate ||
    !inputs.annualSalary ||
    !inputs.semaphoreCommitment
  ) {
    res.status(400).send("Missing query parameter");
    return;
  }

  const startDate = Date.parse(inputs.startDate);
  if (!startDate || startDate > new Date().getTime()) {
    res.status(400).send("Invalid start date");
    return;
  }

  if (inputs.annualSalary < 0) {
    res.status(400).send("Invalid annual salary");
    return;
  }

  try {
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        firstName: { type: "string", value: inputs.firstName },
        lastName: { type: "string", value: inputs.lastName },
        currentEmployer: { type: "string", value: inputs.currentEmployer },
        startDate: { type: "string", value: inputs.startDate },
        annualSalary: { type: "int", value: BigInt(inputs.annualSalary) },
        owner: {
          type: "cryptographic",
          value: BigInt(inputs.semaphoreCommitment)
        }
      } satisfies PODEntries,
      process.env.DEEL_EDDSA_PRIVATE_KEY as string
    );
    const serializedPOD = pod.serialize();
    res.status(200).json({ pod: serializedPOD });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error issue Paystub POD: " + e);
  }
});

export default debug;
