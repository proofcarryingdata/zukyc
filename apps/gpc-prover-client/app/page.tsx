"use client";

import { useCallback, useState } from "react";
import { generateProof, ProofResult } from "@/util/generateProof";
import useIdentity from "@/hooks/useIdentity";
import usePODs from "@/hooks/usePODs";
import SemaphoreID from "@/components/SemaphoreID";
import PODs from "@/components/PODs";

export default function Prover() {
  const [configStr, setConfigStr] = useState("");
  const [proofResult, setProofResult] = useState<ProofResult>();

  const { identity } = useIdentity();
  const { idPODStr, paystubPODStr } = usePODs();

  const generate = useCallback(() => {
    if (!identity) {
      alert("Identity cannot be empty!");
      return;
    }
    generateProof(identity, idPODStr, paystubPODStr, configStr, setProofResult);
  }, [
    identity,
    idPODStr,
    paystubPODStr,
    configStr,
    setProofResult,
    generateProof
  ]);

  return (
    <main className="p-10 m-0 flex flex-col gap-6">
      <h1 className="text-xl font-bold">ZooKyc</h1>
      <div className="flex flex-col">
        <span>GPC prover, paste in PODS, generate proof</span>
        <span>TODO: more description, link to code...</span>
      </div>

      <SemaphoreID />
      <PODs />

      <div className="flex flex-col gap-4 p-4 border rounded border-slate-400">
        <h2 className="text-lg font-bold">Generate proof</h2>
        <div className="flex flex-col gap-2">
          <span>Proof configuration</span>
          <textarea
            rows={4}
            value={configStr}
            placeholder="Past your proof configuration here!"
            onChange={(e) => setConfigStr(e.target.value.trim())}
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
