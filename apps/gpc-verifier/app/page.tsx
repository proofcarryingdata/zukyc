"use client";

import { useCallback } from "react";
import useProofConfig from "@/util/useProofConfig";
import VerifyProof from "@/components/VerifyProof";

export default function Verifier() {
  const onOpenPopup = useCallback(() => {
    const width = 700;
    const height = 500;
    let left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    window.open(
      process.env.NEXT_PUBLIC_GPC_PROVER_CLIENT_URL,
      "ZooKyc",
      `width=${width},height=${height},left=${left},top=${top}`
    );
    return true;
  }, []);

  const proofConfig = useProofConfig();

  return (
    <main className="p-6 m-0 mb-16 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooLender</h1>
      <h2 className="text-lg font-bold">Apply for a loan</h2>

      <h3 className="font-bold">Step 1: generate a proof</h3>
      <ul className="list-inside list-disc">
        <p>You need to prove that</p>
        <li>You have a valid govenment-issued ID;</li>
        <li>You are not in the sanctions list;</li>
        <li>You are at least 18 years old;</li>
        <li>
          You have at least one year of consistent employment with your current
          employer;
        </li>
        <li>Your monthly income is at least $2000;</li>
      </ul>

      <p>
        You can use{" "}
        <a className="text-blue-500" href="#" onClick={onOpenPopup}>
          ZooKyc
        </a>{" "}
        to generate a proof.
      </p>

      <div className="flex flex-col">
        <div className="flex items-center">
          <p>And here is the corresponding proof configuration:</p>
          <button
            className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
            onClick={() => {
              navigator.clipboard.writeText(proofConfig.serializedConfig);
            }}
          >
            📋
          </button>
        </div>
        <textarea rows={4} value={proofConfig.serializedConfig} readOnly />
      </div>

      <h3 className="font-bold">Step 2: verify your proof</h3>
      <p>Paste the proof generated from Zookyc below.</p>
      <p>
        Your loan will be approved if we can successfully verify your proof.
      </p>
      <VerifyProof />
    </main>
  );
}
