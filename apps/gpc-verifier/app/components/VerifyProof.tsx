import { useState } from "react";
import verifyProof from "@/util/verifyProof";
import { useProofRequest } from "@/hooks/useProofRequest";

const VerifyProof = () => {
  const [proofStr, setProofStr] = useState("");
  const [verified, setVerified] = useState(false);

  const { proofRequest, proofRequestBoundConfig } = useProofRequest();

  const verify = async () => {
    try {
      const valid = await verifyProof(
        proofRequest,
        proofRequestBoundConfig,
        proofStr
      );
      setVerified(valid);
    } catch (e) {
      alert(e);
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
