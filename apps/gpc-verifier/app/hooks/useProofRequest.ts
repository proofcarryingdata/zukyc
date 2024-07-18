import { useMemo } from "react";
import JSONBig from "json-bigint";
import { gpcBindConfig } from "@pcd/gpc";
import { proofRequest } from "@/util/proofRequest";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const useProofRequestBoundConfig = () => {
  return useMemo(() => {
    // Checks, binds, and canonicalizes a GPCProofConfig so it can be reused for multiple proofs.
    // https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
    return gpcBindConfig(proofRequest.proofConfig).boundConfig;
  }, []);
};

export const useSerializedProofRequest = () => {
  return useMemo(() => {
    // You can also use serializeGPCProofConfig to serialize the proofConfig,
    // and underlyingly it uses json-bitint like what we are doing here.
    // https://docs.pcd.team/functions/_pcd_gpc.serializeGPCProofConfig.html
    return jsonBigSerializer.stringify(proofRequest, null, 2);
  }, []);
};
