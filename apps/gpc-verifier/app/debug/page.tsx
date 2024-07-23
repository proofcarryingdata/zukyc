"use client";

import { useState } from "react";
import { removeNullifierHash } from "@/util/persistence";

export default function Debug() {
  const [nullifier, setNullifier] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await removeNullifierHash(nullifier);
    alert("Successfully removed");
  };

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Admin</h1>
      <h2 className="text-lg font-bold">For debugging</h2>
      <p>
        This page is for debugging only. It alows you to remove a nullfier hash
        from the kv store.
      </p>
      <p>
        We keep a set of nullifier hash in the kv store. When we verify a proof,
        we check if the nullifier hash is already in the set. If it is, it means
        the proof has already been used to get a loan, and the verification will
        fail. If not and the proof is valid, we'll add the nullifier hash in our
        set, so it cannot be used again.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nullifier"
          className="form-input border px-4 py-3 rounded"
          placeholder="Nullifier hash"
          value={nullifier}
          onChange={(e) => setNullifier(e.target.value)}
        />
        <input
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
          value="Remove nullifier hash"
        />
      </form>
    </main>
  );
}
