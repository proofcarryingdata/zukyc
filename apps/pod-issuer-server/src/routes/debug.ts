import express, { Request, Response } from "express";
import { POD, PODEntries } from "@pcd/pod";

const debug = express.Router();

debug.post("/id/issue", (req: Request, res: Response) => {
  const inputs: {
    idNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    socialSecurityNumber: string;
    semaphorePublicKey: string;
  } = req.body;

  if (
    !inputs.idNumber ||
    !inputs.firstName ||
    !inputs.lastName ||
    !inputs.dateOfBirth ||
    !inputs.socialSecurityNumber ||
    !inputs.semaphorePublicKey
  ) {
    res.status(400).send("Missing query parameter");
    return;
  }

  if (!/^[A-Z][0-9]{7}$/.test(inputs.idNumber)) {
    res.status(400).send("Invalid ID number format");
    return;
  }

  if (isNaN(inputs.dateOfBirth) || inputs.dateOfBirth > new Date().getTime()) {
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
        dateOfBirth: { type: "date", value: new Date(inputs.dateOfBirth) },
        socialSecurityNumber: {
          type: "string",
          value: inputs.socialSecurityNumber
        },
        owner: {
          type: "eddsa_pubkey",
          value: inputs.semaphorePublicKey
        }
      } satisfies PODEntries,
      process.env.GOV_EDDSA_PRIVATE_KEY as string
    );

    const jsonPOD = pod.toJSON();
    const serializedPOD = JSON.stringify(jsonPOD, null, 2);
    res.status(200).json({ pod: serializedPOD });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error issuing ID POD: " + e);
  }
});

debug.post("/paystub/issue", (req: Request, res: Response) => {
  const inputs: {
    firstName: string;
    lastName: string;
    currentEmployer: string;
    startDate: number;
    annualSalary: number;
    socialSecurityNumber: string;
    semaphorePublicKey: string;
  } = req.body;

  if (
    !inputs.firstName ||
    !inputs.lastName ||
    !inputs.currentEmployer ||
    !inputs.startDate ||
    !inputs.annualSalary ||
    !inputs.socialSecurityNumber ||
    !inputs.semaphorePublicKey
  ) {
    res.status(400).send("Missing query parameter");
    return;
  }

  if (isNaN(inputs.startDate) || inputs.startDate > new Date().getTime()) {
    res.status(400).send("Invalid start date");
    return;
  }

  if (isNaN(inputs.annualSalary) || inputs.annualSalary < 0) {
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
        startDate: { type: "date", value: new Date(inputs.startDate) },
        annualSalary: { type: "int", value: BigInt(inputs.annualSalary) },
        issueDate: { type: "date", value: new Date() },
        socialSecurityNumber: {
          type: "string",
          value: inputs.socialSecurityNumber
        },
        owner: {
          type: "eddsa_pubkey",
          value: inputs.semaphorePublicKey
        }
      } satisfies PODEntries,
      process.env.DEEL_EDDSA_PRIVATE_KEY as string
    );

    const jsonPOD = pod.toJSON();
    const serializedPOD = JSON.stringify(jsonPOD, null, 2);
    res.status(200).json({ pod: serializedPOD });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error issue Paystub POD: " + e);
  }
});

export default debug;
