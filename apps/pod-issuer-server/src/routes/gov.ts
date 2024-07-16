import express, { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import jwt from "jsonwebtoken";
import { POD, PODEntries } from "@pcd/pod";
import { getGovUserByEmail, getIDPODByEmail, saveIDPOD } from "../stores/gov";

const gov = express.Router();

gov.post("/login", (req: Request, res: Response) => {
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
    process.env.GOV_EDDSA_PRIVATE_KEY!,
    { algorithm: "HS512", expiresIn: "1h" }
  );
  res.send(token);
});

gov.post(
  "/issue",
  expressjwt({
    secret: process.env.GOV_EDDSA_PRIVATE_KEY!,
    algorithms: ["HS512"]
  }),
  async (req: JWTRequest, res: Response) => {
    const email = req.auth?.email;
    if (!email) {
      res.status(401).send("Unauthorized");
    }

    const inputs: {
      semaphoreCommitment: string;
    } = req.body;

    if (!inputs.semaphoreCommitment) {
      res.status(400).send("Missing query parameter");
      return;
    }

    // We already issued ID POD for this user, return the POD
    const pod = await getIDPODByEmail(email);
    if (pod !== null) {
      res.status(200).json({ pod });
      return;
    }

    const user = getGovUserByEmail(email);
    if (user === null) {
      res.status(404).send("User not found");
      return;
    }

    try {
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          idNumber: { type: "string", value: user.idNumber },
          firstName: { type: "string", value: user.firstName },
          lastName: { type: "string", value: user.lastName },
          age: { type: "int", value: BigInt(user.age) },
          owner: {
            type: "cryptographic",
            value: BigInt(inputs.semaphoreCommitment)
          }
        } satisfies PODEntries,
        process.env.GOV_EDDSA_PRIVATE_KEY!
      );
      const serializedPOD = pod.serialize();

      await saveIDPOD(email, serializedPOD);
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issue ID POD");
    }
  }
);

export default gov;
