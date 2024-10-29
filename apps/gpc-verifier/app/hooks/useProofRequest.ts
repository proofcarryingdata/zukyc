import { useMemo } from "react";
import { gpcBindConfig } from "@pcd/gpc";
import { makeProofRequest, serializeProofRequest } from "@/util/proofRequest";

export const useProofRequest = () => {
  const request = useMemo(() => {
    const now = new Date();
    const proofRequest = makeProofRequest(now);
    return {
      proofRequest,
      // https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
      boundConfig: gpcBindConfig(proofRequest.proofConfig).boundConfig,
      serializedRequest: serializeProofRequest(proofRequest)
    };
  }, []);
  return request;
};
