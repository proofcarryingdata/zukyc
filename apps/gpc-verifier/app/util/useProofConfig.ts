import { useMemo } from "react";
import {
  serializeGPCProofConfig,
  gpcBindConfig,
  GPCProofConfig,
  PODMembershipLists
} from "@pcd/gpc";

const useProofConfig = () => {
  return useMemo(() => {
    // https://docs.pcd.team/types/_pcd_gpc.GPCProofConfig.html
    const proofConfig: GPCProofConfig = {
      // Each POD object mentioned here must be provided in GPCProofInputs.
      // The names assigned here are used to refer these PODs in GPCProofInputs,
      // as well as elsewhere in configuration.
      pods: {
        govID: {
          entries: {
            // Prove the presence of an entry called "idNumber", hide its value,
            // and also prove that it is not a member of the sanctionsList.
            idNumber: { isRevealed: false, isNotMemberOf: "sanctionsList" },
            // Prove the presence of an entry called "dateOfBirth" and hide its value.
            dateOfBirth: { isRevealed: false },
            // Prove the presence of an entry called "owner". I'm not
            // revealing it, but will be proving I own the corresponding
            // Semaphore identity secrets.
            owner: { isRevealed: false, isOwnerID: true }
          }
        },
        paystub: {
          entries: {
            owner: { isRevealed: false, isOwnerID: true }
          }
        }
      }
    };

    // https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
    // Checks, binds, and canonicalizes a GPCProofConfig so it can be reused for multiple proofs.
    const { boundConfig } = gpcBindConfig(proofConfig);

    // https://docs.pcd.team/types/_pcd_gpc.PODMembershipLists.html
    // There's an isNotMemberOf check for govID POD entry idNumber in the proofConfig.
    // This lists has to be both in the proof inputs and the revealed claims.
    const membershipLists: PODMembershipLists = {
      sanctionsList: [
        { type: "string", value: "G2345678" },
        { type: "string", value: "G1987654" },
        { type: "string", value: "G1657678" }
      ]
    };

    const serializedConfig = JSON.stringify({
      proofConfig: serializeGPCProofConfig(proofConfig),
      membershipLists
    });

    return {
      boundConfig,
      membershipLists,
      serializedConfig
    };
  }, []);
};

export default useProofConfig;
