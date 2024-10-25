import { useMemo } from "react";
import { makeProofRequest, serializeProofRequest } from "@/util/proofRequest";

export const useProofRequest = () => {
  const request = useMemo(() => {
    const now = new Date();
    const proofRequest = makeProofRequest(now);
    return {
      proofRequest,
      serializedRequest: serializeProofRequest(proofRequest)
    };
  }, []);
  return request;
};
