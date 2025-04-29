import express, { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { POD, PODEntries } from "@pcd/pod";
import { getGovUserByEmail, getIDPODByEmail, saveIDPOD } from "../stores/gov";
import { handleLogin } from "./util/loginHelper";

const gov = express.Router();

gov.post("/login", (req: Request, res: Response) => {
  handleLogin(req, res, process.env.GOV_JWT_SECRET_KEY!);
});

gov.post(
  "/issue",
  expressjwt({
    secret: process.env.GOV_JWT_SECRET_KEY!,
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
      // We already issued ID POD for this user, return the POD
      const podStr = await getIDPODByEmail(email);
      if (podStr !== null) {
        const pod = POD.fromJSON(JSON.parse(podStr));
        const owner = pod.content.asEntries().owner.value;
        if (owner !== inputs.semaphorePublicKey) {
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

      const user = await getGovUserByEmail(email);
      if (user === null) {
        res.status(404).send("User not found");
        return;
      }

      // In this case, we haven't issued a paystub POD for this user yet,
      // need to issue one and save it for future use.
      // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
      const pod = POD.sign(
        {
          idNumber: { type: "string", value: user.idNumber },
          firstName: { type: "string", value: user.firstName },
          lastName: { type: "string", value: user.lastName },
          dateOfBirth: { type: "int", value: user.dateOfBirth },
          socialSecurityNumber: {
            type: "string",
            value: user.socialSecurityNumber
          },
          owner: {
            type: "eddsa_pubkey",
            value: inputs.semaphorePublicKey
          }
        } satisfies PODEntries,
        process.env.GOV_EDDSA_PRIVATE_KEY!
      );

      const jsonPOD = pod.toJSON();
      const serializedPOD = JSON.stringify(jsonPOD, null, 2);

      await saveIDPOD(email, serializedPOD);
      res.status(200).json({ pod: serializedPOD });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error issuing ID POD: " + e);
    }
  }
);

export default gov;
