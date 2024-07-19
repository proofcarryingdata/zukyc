import { kv } from "@vercel/kv";

// Saves the set of nullifier hashes we have seen
const NULLIFIER_KV_SET = "nullifiers_hash";

// Checks whether we've seen the nullifier hash before.
// If yes, return false; otherwise, returns true, and add the nullfier hash to our set.
export async function tryRecordNullifierHash(
  nullifierHash: bigint
): Promise<boolean> {
  if (!process.env.KV_REST_API_URL) {
    return true;
  }
  if (await kv.sismember(NULLIFIER_KV_SET, nullifierHash.toString())) {
    return false;
  }

  await kv.sadd(NULLIFIER_KV_SET, nullifierHash.toString());
  return true;
}
