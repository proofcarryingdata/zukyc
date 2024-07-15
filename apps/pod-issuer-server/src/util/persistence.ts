import { kv } from "@vercel/kv";

export type GovUser = {
  email: string;
  // hashedPassword: string;
  idPOD: string;
};

export type DeelUser = {
  email: string;
  // hashedPassword: string;
  paystubPOD: string;
};

export type User = {
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
    firstName: names[0],
    lastName: names[1]
  };
}

export async function getGovUser(email: string): Promise<GovUser | undefined> {
  return (await kv.get<GovUser>(email)) ?? undefined;
}
