"use client";

import { useCallback, useState } from "react";
import verifyProof from "@/util/verifyProof";

export default function Verifier() {
  const [proofStr, setProofStr] = useState("");
  const [configStr, setConfigStr] = useState("");
  const [claimsStr, setClaimsStr] = useState("");
  const [verified, setVerified] = useState(false);

  const verify = useCallback(() => {
    verifyProof(proofStr, configStr, claimsStr, setVerified);
  }, [proofStr, configStr, claimsStr, setVerified]);

  return (
    <main className="p-6 m-0 flex flex-col gap-4 h-screen max-h-screen">
      <h1 className="text-xl font-bold">ZooLender</h1>

      <div className="flex flex-col">
        <h2 className="text-lg">To apply for a loan</h2>
        <p>
          You need to prove that you have a valid ID, and your monthly salary is
          above $2k.
        </p>
        <p>TODO: more rules here</p>
      </div>

      <h2 className="text-lg">
        Go to <a>the ZooKyc website</a> to generate a proof, and paste the proof
        below
      </h2>

      <div className="flex flex-col">
        <span>Proof</span>
        <textarea
          rows={10}
          value={proofStr}
          placeholder="Past your proof here!"
          onChange={(e) => setProofStr(e.target.value.trim())}
        />
      </div>
      <div className="flex flex-col">
        <span>Config</span>
        <textarea
          rows={4}
          value={configStr}
          placeholder="Past your config here!"
          onChange={(e) => setConfigStr(e.target.value.trim())}
        />
      </div>
      <div className="flex flex-col">
        <span>Claims</span>
        <textarea
          rows={6}
          value={claimsStr}
          placeholder="Past your claims here!"
          onChange={(e) => setClaimsStr(e.target.value.trim())}
        />
      </div>

      <button onClick={verify}>Verify Proof</button>
      {verified && (
        <div className="text-lg font-bold">🎉 Congrats! Here are 100 🐸</div>
      )}
    </main>
  );
}
