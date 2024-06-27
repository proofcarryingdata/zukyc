"use client";
import { useEffect, useState } from "react";
import generateProof from "@/util/generateProof";

export default function Prover() {
  const [idPODStr, setIDPODStr] = useState("");
  const [proofResult, setProofResult] = useState<any>();

  useEffect(() => {
    (async () => {
      const proof = await generateProof(idPODStr);
      setProofResult(proof);
    })();
  }, [idPODStr, generateProof, setProofResult]);

  return (
    <main className="p-0 m-0 flex flex-col gap-2 h-screen max-h-screen">
      <div className="flex gap-4 flex-1 p-2">Prover</div>
      <textarea
        className="border-none bg-transparent resize-none m-0 p-0 flex-1 outline-none font-mono"
        rows={3}
        value={idPODStr}
        placeholder="Paste fish here!"
        onChange={(e) => setIDPODStr(e.target.value.trim())}
      />
      <div>{proofResult}</div>
    </main>
  );
}
