"use client";

import { useCallback } from "react";
import { useSerializedProofRequest } from "@/hooks/useProofRequest";
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

  const proofRequest = useSerializedProofRequest();

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
        <li>Your annual salary is at least $20,000;</li>
      </ul>

      {/* 
        Here, we ask the user to copy paste the serialized proofConfig and membershipLists
        to the prover, and after the prover generates the proof, copy paste the proof back
        to this verifier.
        In practice, the prover could be inside a wallet or ZuPass. An UI improvement would
        be to request the prover to generate a proof by sending the proofConfig and membershipLists
        directly, and then the prover send back the generated proof. So we can elimiate the copy
        paste.
      */}
      <div className="flex flex-col">
        <p>And below is the corresponding proof request.</p>
        <div className="flex items-center">
          <p>
            You can copy and paste it to{" "}
            <a className="text-blue-500" href="#" onClick={onOpenPopup}>
              ZooKyc
            </a>{" "}
            to generate a proof.
          </p>
          <button
            className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
            onClick={() => {
              navigator.clipboard.writeText(proofRequest.serialized);
            }}
          >
            📋
          </button>
        </div>
        <textarea rows={24} value={proofRequest.prettified} readOnly />
      </div>

      <h3 className="font-bold">Step 2: verify your proof</h3>
      <p>
        Paste the proof generated from{" "}
        <a className="text-blue-500" href="#" onClick={onOpenPopup}>
          ZooKyc
        </a>{" "}
        below.
      </p>
      <p>
        Your loan will be approved if we can successfully verify your proof.
      </p>
      <VerifyProof />
    </main>
  );
}
