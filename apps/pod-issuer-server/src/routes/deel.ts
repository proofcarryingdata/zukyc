import express, { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { POD, PODEntries } from "@pcd/pod";
import { getDeelUserByEmail } from "../stores/deel";
import { handleLogin } from "./util/loginHelper";
import { checkSemaphorePublicKey } from "../stores/shared";

const deel = express.Router();

deel.post("/login", (req: Request, res: Response) => {
  handleLogin(req, res, process.env.DEEL_JWT_SECRET_KEY!);
});

deel.post(
  "/issue",
  expressjwt({
    secret: process.env.DEEL_JWT_SECRET_KEY!,
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
      semaphorePublicKey: string;
    } = req.body;

    if (!inputs.semaphorePublicKey) {
      res.status(400).send("Missing query parameter");
      return;
    }

    try {
      if (!checkSemaphorePublicKey(email, inputs.semaphorePublicKey)) {
        res
          .status(400)
          .send("Semaphore commitment does not match what is on the record.");
        return;
      }

      const user = await getDeelUserByEmail(email);
      if (user === null) {
        res.status(404).send("User not found");
        return;
      }

      // Issue a paystub POD
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          firstName: { type: "string", value: user.firstName },
          lastName: { type: "string", value: user.lastName },
          currentEmployer: { type: "string", value: "ZooPark" },
          startDate: { type: "date", value: new Date(user.startDate) },
          issueDate: { type: "date", value: new Date() },
          annualSalary: { type: "int", value: BigInt(user.annualSalary) },
          socialSecurityNumber: {
            type: "string",
            value: user.socialSecurityNumber
          },
          owner: {
            type: "eddsa_pubkey",
            value: inputs.semaphorePublicKey
          }
        } satisfies PODEntries,
        process.env.DEEL_EDDSA_PRIVATE_KEY!
      );

      const jsonPOD = pod.toJSON();
      const serializedPOD = JSON.stringify(jsonPOD, null, 2);
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issuing Paystub POD: " + e);
    }
  }
);

export default deel;
