import Chance from "chance";
import JSONBig from "json-bigint";
import { createClient } from "@vercel/kv";

export const chance = new Chance();

export const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const podIssuerKV = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: false
});

export async function getSSNByEmail(email: string) {
  // randomly generate SSN
  // In practice, look it up in the database
  let ssn = await podIssuerKV.hget<string>(email, "ssn");
  if (!ssn) {
    ssn = chance.ssn();
  }
  await podIssuerKV.hset(email, { ssn: ssn });
  return ssn;
}

export async function checkSemaphoreCommitment(
  email: string,
  semaphoreCommitment: string
) {
  const savedCommitment = await podIssuerKV.hget<string>(
    email,
    "semaphoreCommitment"
  );
  if (savedCommitment === null) {
    await podIssuerKV.hset(email, { semaphoreCommitment: semaphoreCommitment });
    return true;
  }
  return savedCommitment === semaphoreCommitment;
}
