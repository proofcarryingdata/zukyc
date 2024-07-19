import express, { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { POD, PODEntries } from "@pcd/pod";
import {
  getDeelUserByEmail,
  getPaystubPODByEmail,
  savePaystubPOD
} from "../stores/deel";
import { handleLogin } from "./util/loginHelper";

const deel = express.Router();

deel.post("/login", (req: Request, res: Response) => {
  handleLogin(req, res, process.env.DEEL_EDDSA_PRIVATE_KEY!);
});

deel.post(
  "/issue",
  expressjwt({
    secret: process.env.DEEL_EDDSA_PRIVATE_KEY!,
    algorithms: ["HS512"]
  }),
  async (req: JWTRequest, res: Response) => {
    const email = req.auth?.email;
    if (!email) {
      res.status(401).send("Unauthorized");
      return;
    }

    // In practice, the user should have to prove that they
    // own the semaphore identity secret corresponding to this
    // semaphore identity commiment.
    const inputs: {
      semaphoreCommitment: string;
    } = req.body;

    if (!inputs.semaphoreCommitment) {
      res.status(400).send("Missing query parameter");
      return;
    }

    try {
      // We already issued paystub POD for this user, return the POD
      const podStr = await getPaystubPODByEmail(email);
      if (podStr !== null) {
        const pod = POD.deserialize(podStr);
        const owner = pod.content.asEntries().owner.value;
        if (owner !== BigInt(inputs.semaphoreCommitment)) {
          res
            .status(400)
            .send(
              "Already issued POD for this user, but Semaphore Commitment doesn't match."
            );
          return;
        }
        res.status(200).json({ pod: podStr });
        return;
      }

      const user = getDeelUserByEmail(email);
      if (user === null) {
        res.status(404).send("User not found");
        return;
      }

      // In this case, we haven't issued a paystub POD for this user yet,
      // need to issue one and save it for future use.
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          firstName: { type: "string", value: user.firstName },
          lastName: { type: "string", value: user.lastName },
          currentEmployer: { type: "string", value: "ZooPark" },
          startDate: { type: "int", value: user.startDate },
          issueDate: { type: "int", value: BigInt(new Date().getTime()) },
          annualSalary: { type: "int", value: BigInt(user.annualSalary) },
          owner: {
            type: "cryptographic",
            value: BigInt(inputs.semaphoreCommitment)
          }
        } satisfies PODEntries,
        process.env.DEEL_EDDSA_PRIVATE_KEY!
      );
      const serializedPOD = pod.serialize();

      await savePaystubPOD(email, serializedPOD);
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issuing Paystub POD: " + e);
    }
  }
);

export default deel;
