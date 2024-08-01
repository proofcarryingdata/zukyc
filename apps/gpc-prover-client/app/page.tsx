"use client";

import { useCallback, useState } from "react";
import { Tooltip } from "react-tooltip";
import { generateProof } from "@/util/generateProof";
import useIdentity from "@/hooks/useIdentity";
import SemaphoreID from "@/components/SemaphoreID";
import PODs from "@/components/PODs";
import usePODs from "@/hooks/usePODs";

export default function Prover() {
  const [proofRequestStr, setProofRequestStr] = useState("");
  const [proofResult, setProofResult] = useState<string | null>(null);

  const identity = useIdentity();
  const { idPODStr, paystubPODStr } = usePODs();

  const generate = async () => {
    if (!identity) {
      alert("Identity cannot be empty!");
      return;
    }

    try {
      const proof = await generateProof(
        identity,
        idPODStr,
        paystubPODStr,
        proofRequestStr
      );
      setProofResult(proof);
    } catch (e) {
      alert(`Error generating proof. \n${(e as Error).message}`);
      console.log(e);
      setProofResult(null);
    }
  };

  const reset = useCallback(() => {
    if (
      window.confirm(
        "Are you sure? We will clear your current identity and PODs."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  return (
    <main className="p-10 m-0 flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ZooKyc</h1>
        <a onClick={reset}>Reset</a>
      </div>
      <div className="flex flex-col">
        <span>
          ZooKyc manages your identity, PODs (e.g. ID POD and paystub POD), and
          generate proofs upon requests.
        </span>
      </div>

      <SemaphoreID />
      <PODs />

      <div className="flex flex-col gap-4 p-4 border rounded border-slate-400">
        <h2 className="text-lg font-bold">Generate proof</h2>
        <div className="flex gap-2">
          <span className="font-bold">Proof request</span>
          <span className="info-tooltip-anchor">❗</span>
          <Tooltip anchorSelect=".info-tooltip-anchor">
            This is what you want to prove. You can get it from{" "}
            {process.env.NEXT_PUBLIC_GPC_VERIFIER_URL}.
          </Tooltip>
        </div>
        <textarea
          rows={20}
          value={proofRequestStr}
          placeholder="Past your proof request here!"
          onChange={(e) => setProofRequestStr(e.target.value.trim())}
          id="proof-request"
        />
        <div>
          <button onClick={generate}>Generate Proof</button>
        </div>

        {proofResult && (
          <div className="flex flex-col">
            <div className="flex flex-1 gap-1 items-center">
              <span className="font-bold">Result</span>
              <button
                className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
                onClick={() => {
                  navigator.clipboard.writeText(proofResult);
                }}
              >
                📋
              </button>
            </div>
            <textarea
              className="border-none"
              readOnly
              rows={30}
              value={proofResult}
              id="proof-result"
            />
          </div>
        )}
      </div>
    </main>
  );
}
