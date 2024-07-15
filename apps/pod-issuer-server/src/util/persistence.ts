import { createClient } from "@vercel/kv";

const podIssuerKV = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: false
});

export type User = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
};

export function getUserByEmail(email: string): User | null {
  // In practice, look up the user in the database
  const names = email.replace(/@zoo.com$/, "").split(".");
  if (names.length != 2) {
    return null;
  }
  return {
    email,
    firstName: names[0],
    lastName: names[1]
  };
}

export async function getIDPODByEmail(email: string): Promise<string | null> {
  const key = `id-${email}`;
  return await podIssuerKV.get<string>(key);
}

export async function saveIDPOD(email: string, serializedPOD: string) {
  await podIssuerKV.set(`id-${email}`, serializedPOD);
}

export async function getPaystubPODByEmail(
  email: string
): Promise<string | null> {
  const key = `paystub-${email}`;
  return await podIssuerKV.get<string>(key);
}

export async function savePaystubPOD(email: string, serializedPOD: string) {
  await podIssuerKV.set(`paystub-${email}`, serializedPOD);
}
