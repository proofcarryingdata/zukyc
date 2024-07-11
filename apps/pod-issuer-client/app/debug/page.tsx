"use client";

import IDPOD from "@/debug/components/IDPOD";
import PaystubPOD from "@/debug/components/PaystubPOD";

export default function Debug() {
  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooAdmin</h1>
      <h2 className="text-lg font-bold">For debugging / demo</h2>
      <p>
        This page is for debugging / demo only. It alows you to generate ID PODs
        and Paystub PODs with information you provide.
      </p>
      <p>
        You can try to generate PODs with different information, use these PODs
        as inputs to gpc prover and see what happens.
      </p>

      <IDPOD />
      <PaystubPOD />
    </main>
  );
}
