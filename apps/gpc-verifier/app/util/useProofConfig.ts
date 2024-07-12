import { useMemo } from "react";
import { serializeGPCProofConfig, GPCProofConfig } from "@pcd/gpc";

const useProofConfig = () => {
  return useMemo(() => {
    const proofConfig: GPCProofConfig = {
      pods: {
        govID: {
          entries: {
            // prove the presence of an entry called "dateOfBirth" and hide its value.
            dateOfBirth: { isRevealed: false },
            // Prove the presence of an entry called "owner". I'm not
            // revealing it, but will be proving I own the corresponding
            // Semaphore identity secrets.
            owner: { isRevealed: false, isOwnerID: true }
          }
        }
      }
    };

    return {
      config: proofConfig,
      serializedConfig: serializeGPCProofConfig(proofConfig)
    };
  }, []);
};

export default useProofConfig;
