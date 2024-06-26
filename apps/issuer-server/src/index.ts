import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const main = async () => {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  const port = process.env.PORT || 3001;

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.listen(port, () => {
    console.log(`[server]: Server ready on port ${port}`);
  });
};

main();
