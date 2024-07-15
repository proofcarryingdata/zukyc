"use client";

import { useCallback, useState } from "react";
import { generateProof, ProofResult } from "@/util/generateProof";
import useIdentity from "@/hooks/useIdentity";
import SemaphoreID from "@/components/SemaphoreID";
import PODs from "@/components/PODs";
import usePODs from "@/hooks/usePODs";

export default function Prover() {
  const [requestStr, setRequestStr] = useState("");
  const [proofResult, setProofResult] = useState<ProofResult>();

  const identity = useIdentity();
  const { idPODStr, paystubPODStr } = usePODs();

  const generate = useCallback(() => {
    if (!identity) {
      alert("Identity cannot be empty!");
      return;
    }

    generateProof(
      identity,
      idPODStr,
      paystubPODStr,
      requestStr,
      setProofResult
    );
  }, [identity, idPODStr, paystubPODStr, requestStr]);

  return (
    <main className="p-10 m-0 flex flex-col gap-6">
      <h1 className="text-xl font-bold">ZooKyc</h1>
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
        <div className="flex flex-col gap-2">
          <span>
            Proof request (including proof config, and optionally membership
            lists, external nullifier and watermark)
          </span>
          <textarea
            rows={10}
            value={requestStr}
            placeholder="Past your proof request here!"
            onChange={(e) => setRequestStr(e.target.value.trim())}
          />
        </div>
        <div>
          <button onClick={generate}>Generate Proof</button>
        </div>

        {proofResult && (
          <div>
            <div className="flex flex-1 gap-1 items-center">
              <span className="font-bold">Result</span>
              <button
                className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(proofResult));
                }}
              >
                📋
              </button>
            </div>

            <div className="flex flex-col">
              <p>Config:</p>
              <textarea
                className="border-none"
                readOnly
                rows={4}
                value={proofResult?.config}
              />
              <p>Proof:</p>
              <textarea
                className="border-none"
                readOnly
                rows={10}
                value={proofResult?.proof}
              />
              <p>Claims:</p>
              <textarea
                className="border-none"
                readOnly
                rows={6}
                value={proofResult?.claims}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
