import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { POD, PODEntries } from "@pcd/pod";

dotenv.config();

const EDDSA_PRIVATE_KEY = process.env.EDDSA_PRIVATE_KEY || "";

const main = async () => {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  const port = process.env.PORT || 3003;

  app.get("/", (req: Request, res: Response) => {
    res.send("Zukyc Server");
  });

  app.post("/issue", (req: Request, res: Response) => {
    const inputs: {
      firstName: string;
      lastName: string;
      age: bigint;
      semaphoreCommitment: bigint;
    } = req.body;

    // Verify the inputs here

    // If verified, issue pods
    // For more info, see https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts
    const pod = POD.sign(
      {
        firstName: { type: "string", value: inputs.firstName },
        lastName: { type: "string", value: inputs.lastName },
        age: { type: "int", value: inputs.age },
        owner: {
          type: "cryptographic",
          value: inputs.semaphoreCommitment
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
