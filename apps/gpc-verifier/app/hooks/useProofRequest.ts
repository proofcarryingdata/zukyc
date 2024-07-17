import { useMemo } from "react";
import JSONBig from "json-bigint";
import { gpcBindConfig, GPCProofConfig, PODMembershipLists } from "@pcd/gpc";
import { POD_INT_MAX } from "@pcd/pod";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

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
        // Prove the presence of an entry called "firstName", hide its value.
        firstName: { isRevealed: false },
        // Prove the presence of an entry called "lastName", hide its value.
        lastName: { isRevealed: false },
        // Prove the presence of an entry called "age", hide its value.
        // and prove that it is >= 18
        age: {
          isRevealed: false,
          inRange: { min: 18n, max: POD_INT_MAX }
        },
        // Prove the presence of an entry called "owner", hide its value, and prove
        // that I own the corresponding Semaphore identity secrets.
        owner: { isRevealed: false, isOwnerID: true }
      }
    },
    paystub: {
      entries: {
        // Prove the presence of an entry called "firstName", hide its value, and
        // prove that it equals to the firstName in the govID POD.
        firstName: { isRevealed: false, equalsEntry: "govID.firstName" },
        // Prove the presence of an entry called "lastName", hide its value, and
        // prove that it equals to the lastName in the govID POD.
        lastName: { isRevealed: false, equalsEntry: "govID.lastName" },
        // There's an entry "currentEmployer" in the paystub POD, because it is
        // not specified here, it will be ignored, meaning the proof says nothiing
        // about the entry, and the entry won't be in the revealed claims.
        // currentEmployer: {}
        // Prove the presence of an entry called "startDate", reveal its value.
        startDate: { isRevealed: true },
        // Prove the presence of an entry called "annualSalary", hide its value,
        // and prove that it is >= 20000
        annualSalary: {
          isRevealed: false,
          inRange: { min: 20000n, max: POD_INT_MAX }
        },
        // Prove the presence of an entry called "owner", hide its value, and prove
        // that I own the corresponding Semaphore identity secrets.
        owner: { isRevealed: false, isOwnerID: true }
      }
    }
  }
};

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

// https://docs.pcd.team/functions/_pcd_gpc.gpcBindConfig.html
// Checks, binds, and canonicalizes a GPCProofConfig so it can be reused for multiple proofs.
const useBoundConfig = () => {
  return useMemo(() => {
    const { boundConfig } = gpcBindConfig(proofConfig);
    return boundConfig;
  }, []);
};

// We can optionally ask to generate a nullifier, which is tied to the user's
// identity and to the external nullifier value here. This can be used
// to identify duplicate proofs without de-anonymizing.
const externalNullifier = "ZooKyc";

// Watermark will be included in the resulting proof.
// This allows identifying a proof as tied to a specific use case, to avoid reuse.
const watermark = "ZooKyc ZooLender challenge";

export const useProofRequest = () => {
  const boundConfig = useBoundConfig();

  return useMemo(() => {
    return {
      boundConfig,
      membershipLists,
      externalNullifier,
      watermark
    };
  }, [boundConfig]);
};

export const useSerializedProofRequest = () => {
  return useMemo(() => {
    // You can also use serializeGPCProofConfig to serialize the proofConfig,
    // and underlyingly it uses json-bitint like what we are doing here.
    // https://docs.pcd.team/functions/_pcd_gpc.serializeGPCProofConfig.html
    return jsonBigSerializer.stringify(
      {
        proofConfig,
        membershipLists,
        externalNullifier,
        watermark
      },
      null,
      2
    );
  }, []);
};
