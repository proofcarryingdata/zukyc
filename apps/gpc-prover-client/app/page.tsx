"use client";

import { useCallback, useMemo, useState } from "react";
import { generateProof, ProofResult } from "@/util/generateProof";
import { Identity } from "@semaphore-protocol/identity";
import GenerateIdentity from "@/components/GenerateIdentity";

export default function Prover() {
  const [identityStr, setIdentityStr] = useState("");
  const [idPODStr, setIDPODStr] = useState("");
  const [paystubPODStr, setPaystubPODStr] = useState("");
  const [proofResult, setProofResult] = useState<ProofResult>();

  const generate = useCallback(() => {
    if (!identityStr) {
      alert("Private identity secret field cannot be empty!");
      return;
    }
    const identity = new Identity(identityStr);
    generateProof(idPODStr, identity, setProofResult);
  }, [identityStr, idPODStr, setProofResult, generateProof]);

  return (
    <main className="p-10 m-0 flex flex-col gap-6 h-screen max-h-screen">
      <h1 className="text-lg font-bold">Zukyc</h1>
      <div className="flex flex-col">
        <span>GPC prover, paste in PODS, generate proof</span>
        <span>TODO: more description, link to code...</span>
      </div>

      <div className="flex flex-col">
        <span>
          Paste in your private identity secret (Semaphore private identity)
        </span>
        <span>
          If you don't have one, click the Generate New Identity button below
        </span>
        <textarea
          rows={1}
          value={identityStr}
          placeholder="Past your private identity secret here!"
          onChange={(e) => setIdentityStr(e.target.value.trim())}
        />
      </div>
      <GenerateIdentity />

      <div className="flex gap-10">
        <div className="flex flex-col gap-6 w-1/2">
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
        </div>

        <div className="flex flex-col gap-6 w-1/2">
          <div className="flex flex-col">
            <span>Proof:</span>
            <textarea
              className="border-none"
              readOnly
              rows={8}
              value={proofResult?.proof}
            />
          </div>

          <div className="flex flex-col">
            <span>Config:</span>
            <textarea
              className="border-none"
              readOnly
              rows={8}
              value={proofResult?.config}
            />
          </div>

          <div className="flex flex-col">
            <span>Claims:</span>
            <textarea
              className="border-none"
              readOnly
              rows={8}
              value={proofResult?.claims}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
