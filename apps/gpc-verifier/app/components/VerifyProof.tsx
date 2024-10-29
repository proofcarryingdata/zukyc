import { useState } from "react";
import verifyProof from "@/util/verifyProof";
import { ProofRequest } from "@/util/proofRequest";
import { GPCBoundConfig } from "@pcd/gpc";

const VerifyProof = ({
  proofRequest,
  boundConfig
}: {
  proofRequest: ProofRequest;
  boundConfig: GPCBoundConfig;
}) => {
  const [proofStr, setProofStr] = useState("");
  const [verified, setVerified] = useState(false);

  const verify = async () => {
    try {
      const valid = await verifyProof(proofRequest, boundConfig, proofStr);
      setVerified(valid);
    } catch (e) {
      alert(`Error verifying proof. \n${(e as Error).message}`);
      console.log(e);
      setVerified(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <span>Proof</span>
        <textarea
          rows={16}
          value={proofStr}
          placeholder="Past your proof here!"
          onChange={(e) => setProofStr(e.target.value.trim())}
          id="proof"
        />
      </div>

      <button onClick={verify}>Verify Proof</button>
      {verified && (
        <div className="text-lg font-bold">
          🎉 Congrats! Your loan has been approved! 🐸
        </div>
      )}
    </>
  );
};

export default VerifyProof;
