import Chance from "chance";
import { createClient } from "@vercel/kv";

export const chance = new Chance();

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

export async function checkSemaphorePublicKey(
  email: string,
  semaphorePublicKey: string
) {
  const savedPublicKey = await podIssuerKV.hget<string>(
    email,
    "semaphorePublicKey"
  );
  if (savedPublicKey === null) {
    await podIssuerKV.hset(email, { semaphorePublicKey: semaphorePublicKey });
    return true;
  }
  return savedPublicKey === semaphorePublicKey;
}
