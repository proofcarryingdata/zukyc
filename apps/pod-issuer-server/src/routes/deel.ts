import express, { Request, Response } from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { POD, PODEntries } from "@pcd/pod";
import {
  DEMO_FIRSTNAME,
  DEMO_LASTNAME,
  DEMO_CURRENT_EMPLOYER,
  DEMO_START_DATE,
  DEMO_ANNUAL_SALARY
} from "../util/constants";

const deel = express.Router();

deel.post("/login", (req: Request, res: Response) => {
  const inputs: { email: string; password: string } = req.body;
  if (!inputs.email || !inputs.password) {
    res.status(400).send("Missing query parameter");
    return;
  }

  // In practice, get user information from database by email,
  // Here for demo purposes, we'll allow any email with @zoo.com domain
  if (!inputs.email.endsWith("@zoo.com")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // In practice, check if the encrypted password match
  // This is just for demo purposes
  if (!inputs.password.startsWith("zoo")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // Signing JWT, valid for 1 hour
  const token = jwt.sign(
    { email: inputs.email },
    process.env.DEEL_EDDSA_PRIVATE_KEY!,
    { algorithm: "HS512", expiresIn: "1h" }
  );
  res.send(token);
});

deel.post(
  "/issue",
  expressjwt({
    secret: process.env.DEEL_EDDSA_PRIVATE_KEY!,
    algorithms: ["HS512"]
  }),
  (req: Request, res: Response) => {
    const inputs: {
      semaphoreCommitment: string;
    } = req.body;

    if (!inputs.semaphoreCommitment) {
      res.status(400).send("Missing query parameter");
      return;
    }

    // In practice, look up the user information in the database

    try {
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          firstName: { type: "string", value: DEMO_FIRSTNAME },
          lastName: { type: "string", value: DEMO_LASTNAME },
          currentEmployer: { type: "string", value: DEMO_CURRENT_EMPLOYER },
          startDate: { type: "string", value: DEMO_START_DATE },
          annualSalary: { type: "int", value: BigInt(DEMO_ANNUAL_SALARY) },
          owner: {
            type: "cryptographic",
            value: BigInt(inputs.semaphoreCommitment)
          }
        } satisfies PODEntries,
        process.env.DEEL_EDDSA_PRIVATE_KEY!
      );
      const serializedPOD = pod.serialize();
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issue ID POD");
    }
  }
);

export default deel;
