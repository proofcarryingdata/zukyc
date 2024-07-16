import Chance from "chance";
import _ from "lodash";
import { createClient } from "@vercel/kv";

const podIssuerKV = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: false
});

const chance = new Chance();

export type GovUser = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
  age: number;
  idNumber: string;
};

export function getGovUserByEmail(email: string): GovUser | null {
  // randomly generate GovUser fields
  // In practice, look up the user in the database
  const names = email.replace(/@zoo.com$/, "").split(".");
  if (names.length < 1) {
    return null;
  }

  if (names.length === 1) {
    const lastName = chance.last();
    names.push(lastName);
  }

  const age = chance.age({ type: "adult" });
  const idNumber = chance.string({ pool: "0123456789", length: 7 });

  return {
    email,
    firstName: _.upperFirst(names[0]),
    lastName: _.upperFirst(names[1]),
    age,
    idNumber: `G${idNumber}`
  };
}

export async function getIDPODByEmail(email: string): Promise<string | null> {
  const key = `id-${email}`;
  return await podIssuerKV.get<string>(key);
}

export async function saveIDPOD(email: string, serializedPOD: string) {
  await podIssuerKV.set(`id-${email}`, serializedPOD);
}

export type DeelUser = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
  startDate: string;
  annualSalary: number;
};
