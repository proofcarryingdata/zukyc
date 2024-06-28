"use client";

import { useCallback, useState } from "react";
import generateProof from "@/util/generateProof";

export default function Prover() {
  const [idPODStr, setIDPODStr] = useState("");
  const [paystubPODStr, setPaystubPODStr] = useState("");
  const [proofResult, setProofResult] = useState<any>();

  const generate = useCallback(() => {
    const result = generateProof(idPODStr);
    setProofResult(result);
  }, [idPODStr, setProofResult]);

  return (
    <main className="p-10 m-0 flex flex-col gap-6 h-screen max-h-screen w-2/3">
      <h1 className="text-lg font-bold">Zukyc</h1>
      <p>GPC prover, paste in PODS, generate proof</p>
      <p>TODO: more description, link to code...</p>

      <div className="flex flex-col">
        <span>Get your ID POD from the government website</span>
        <textarea
          rows={10}
          value={idPODStr}
          placeholder="Past your ID POD here!"
          onChange={(e) => setIDPODStr(e.target.value.trim())}
        />
      </div>

      <div className="flex flex-col">
        <span>Get your Paystub POD from the deel website</span>
        <textarea
          rows={10}
          value={paystubPODStr}
          placeholder="Past your Paystub POD here!"
          onChange={(e) => setPaystubPODStr(e.target.value.trim())}
        />
      </div>

      <button onClick={generate}>Generate Proof</button>
      <p>This is the result</p>
    </main>
  );
}
