import { useMemo } from "react";
import JSONBig from "json-bigint";
import { gpcBindConfig } from "@pcd/gpc";
import { makeProofRequest } from "@/util/proofRequest";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const useProofRequest = () => {
  const request = useMemo(() => {
    const now = new Date();
    const proofRequest = makeProofRequest(now);
    return {
      proofRequest,
      // You can also use serializeGPCProofConfig to serialize the proofConfig,
      // and underlyingly it uses json-bigint like what we are doing here.
      // https://docs.pcd.team/functions/_pcd_gpc.serializeGPCProofConfig.html
      serializedRequest: jsonBigSerializer.stringify(proofRequest, null, 2),
      // Checks, binds, and canonicalizes a GPCProofConfig so it can be reused for multiple proofs.
      // https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
      boundConfig: gpcBindConfig(proofRequest.proofConfig).boundConfig
    };
  }, []);
  return request;
};
