import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { POD, PODEntries } from "@pcd/pod";

dotenv.config();

const EDDSA_PRIVATE_KEY =
  process.env.EDDSA_PRIVATE_KEY ||
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const main = async () => {
  const app: Express = express();
  app.use(express.json());
  const port = process.env.PORT || 3003;

  app.get("/", (req: Request, res: Response) => {
    res.send("Zukyc Server");
  });

  app.post("/issue", (req: Request, res: Response) => {
    const inputs: {
      firstName: string;
      lastName: string;
      age: string;
      semaphoreCommitment: string;
    } = req.body;

    // TODO: validate the inputs here

    // If valid, issue pods
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        firstName: { type: "string", value: inputs.firstName },
        lastName: { type: "string", value: inputs.lastName },
        age: { type: "int", value: BigInt(inputs.age) },
        owner: {
          type: "cryptographic",
          value: BigInt(inputs.semaphoreCommitment)
        }
      } satisfies PODEntries,
      EDDSA_PRIVATE_KEY
    );
    const serializedPOD = pod.serialize();
    res.status(200).json({ pod: serializedPOD });
  });

  app.listen(port, () => {
    console.log(`[server]: Server ready on port ${port}`);
  });
};

main();
