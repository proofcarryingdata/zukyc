import { kv } from "@vercel/kv";

// Saves the set of nullifier hashes we have seen
const NULLIFIER_KV_SET = "nullifiers_hash";

// Checks whether we've seen the nullifier hash before.
// If yes, return false; otherwise, returns true, and add the nullfier hash to our set.
export async function tryRecordNullifierHash(
  nullifierHash: bigint
): Promise<boolean> {
  if (await kv.sismember(NULLIFIER_KV_SET, nullifierHash.toString())) {
    return false;
  }
  await kv.sadd(NULLIFIER_KV_SET, nullifierHash.toString());
  return true;
}

// Remove the nullifier hash from the set. For debugging use.
export async function removeNullifierHash(
  nullifierHash: string
): Promise<number> {
  return await kv.srem(NULLIFIER_KV_SET, nullifierHash);
}
