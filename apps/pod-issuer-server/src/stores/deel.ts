import Chance from "chance";
import _ from "lodash";
import { createClient } from "@vercel/kv";

const podIssuerKV = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: false
});

const chance = new Chance();

export type DeelUser = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
  startDate: bigint;
  annualSalary: bigint;
};

export function getDeelUserByEmail(email: string): DeelUser | null {
  // randomly generate DeelUser fields
  // In practice, look up the user in the database
  const names = email.replace(/@zoo.com$/, "").split(".");
  if (names.length < 2) {
    return null;
  }

  const startDate = chance.birthday({ type: "child" }) as Date;
  const annualSalary = chance.integer({ min: 20000, max: 1000000 });

  return {
    email,
    firstName: _.upperFirst(names[0]),
    lastName: _.upperFirst(names[1]),
    startDate: BigInt(startDate.getTime()),
    annualSalary: BigInt(annualSalary)
  };
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
