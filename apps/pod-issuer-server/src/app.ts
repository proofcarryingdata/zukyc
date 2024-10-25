import express, { Express, Response, Request, NextFunction } from "express";
import cors from "cors";
import debug from "./routes/debug";
import deel from "./routes/deel";
import gov from "./routes/gov";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/gov", gov);
app.use("/deel", deel);
app.use("/debug", debug);

app.get("/", (_, res: Response) => {
  res.send("Zukyc Pod Issuer Server");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).send(err);
});

export default app;
