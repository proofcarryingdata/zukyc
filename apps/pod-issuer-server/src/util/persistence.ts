import { kv } from "@vercel/kv";

export type GovUser = {
  userId: string;
  email: string;
  // hashedPassword: string;
  semaphoreCommitment: BigInt;
  idPOD: string;
};

export type DeelUser = {
  userId: string;
  email: string;
  // hashedPassword: string;
  semaphoreCommitment: BigInt;
  paystubPOD: string;
};

export async function getGovUser(email: string): Promise<GovUser | undefined> {
  return (await kv.get<GovUser>(email)) ?? undefined;
}
