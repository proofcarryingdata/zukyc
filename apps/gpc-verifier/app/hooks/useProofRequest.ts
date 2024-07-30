import { useMemo } from "react";
import JSONBig from "json-bigint";
import { gpcBindConfig } from "@pcd/gpc";
import { proofRequest } from "@/util/proofRequest";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const useProofRequest = () => {
  // We need to memorize the proof request because some fields uses "new Date()" for time.
  return useMemo(() => {
    return {
      proofRequest,
      // Checks, binds, and canonicalizes a GPCProofConfig so it can be reused for multiple proofs.
      // https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
      proofRequestBoundConfig: gpcBindConfig(proofRequest.proofConfig)
        .boundConfig
    };
  }, []);
};

export const useSerializedProofRequest = () => {
  const request = useProofRequest();

  return useMemo(() => {
    // You can also use serializeGPCProofConfig to serialize the proofConfig,
    // and underlyingly it uses json-bigint like what we are doing here.
    // https://docs.pcd.team/functions/_pcd_gpc.serializeGPCProofConfig.html
    return jsonBigSerializer.stringify(request.proofRequest, null, 2);
  }, [request]);
};
