"use client";

import { useCallback, useState } from "react";
import { generateProof, ProofResult } from "@/util/generateProof";
import useIdentity from "@/util/useIdentity";
import SemaphoreID from "@/components/SemaphoreID";

export default function Prover() {
  const [idPODStr, setIDPODStr] = useState("");
  const [paystubPODStr, setPaystubPODStr] = useState("");
  const [proofResult, setProofResult] = useState<ProofResult>();

  const { identity } = useIdentity();

  const generate = useCallback(() => {
    if (!identity) {
      alert("Identity cannot be empty!");
      return;
    }
    generateProof(idPODStr, identity, setProofResult);
  }, [identity, idPODStr, setProofResult, generateProof]);

  return (
    <main className="p-10 m-0 flex flex-col gap-6">
      <h1 className="text-xl font-bold">ZooKyc</h1>
      <div className="flex flex-col">
        <span>GPC prover, paste in PODS, generate proof</span>
        <span>TODO: more description, link to code...</span>
      </div>

      <SemaphoreID />

      <div className="flex gap-10">
        <div className="flex flex-col gap-6 w-1/2">
          <div className="flex flex-col">
            <span>
              Get your ID POD from <a>ZooGov website</a>
            </span>
            <textarea
              rows={10}
              value={idPODStr}
              placeholder="Past your ID POD here!"
              onChange={(e) => setIDPODStr(e.target.value.trim())}
            />
          </div>

          <div className="flex flex-col">
            <span>
              Get your Paystub POD from <a>ZooDeel website</a>
            </span>
            <textarea
              rows={10}
              value={paystubPODStr}
              placeholder="Past your Paystub POD here!"
              onChange={(e) => setPaystubPODStr(e.target.value.trim())}
            />
          </div>

          <button onClick={generate}>Generate Proof</button>
        </div>

        <div className="flex flex-col gap-6 w-1/2">
          <div className="flex flex-col">
            <div className="flex flex-1 gap-1 items-center">
              <span>Proof:</span>
              {proofResult && (
                <button
                  className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard.writeText(proofResult?.proof);
                  }}
                >
                  📋
                </button>
              )}
            </div>
            <textarea
              className="border-none"
              readOnly
              rows={10}
              value={proofResult?.proof}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-1 gap-1 items-center">
              <span>Config:</span>
              {proofResult && (
                <button
                  className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard.writeText(proofResult?.config);
                  }}
                >
                  📋
                </button>
              )}
            </div>
            <textarea
              className="border-none"
              readOnly
              rows={4}
              value={proofResult?.config}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-1 gap-1 items-center">
              <span>Claims:</span>
              {proofResult && (
                <button
                  className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard.writeText(proofResult?.claims);
                  }}
                >
                  📋
                </button>
              )}
            </div>
            <textarea
              className="border-none"
              readOnly
              rows={6}
              value={proofResult?.claims}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
