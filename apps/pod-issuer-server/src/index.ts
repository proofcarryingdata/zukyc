import dotenv from "dotenv";
dotenv.config();

if (!process.env.GOV_EDDSA_PRIVATE_KEY) {
  throw new Error("expect process.env.GOV_EDDSA_PRIVATE_KEY");
}

if (!process.env.DEEL_EDDSA_PRIVATE_KEY) {
  throw new Error("expect process.env.DEEL_EDDSA_PRIVATE_KEY");
}

import app from "./app";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`[server]: Server ready on port ${port}`);
});
