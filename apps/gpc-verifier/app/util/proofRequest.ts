import { GPCProofConfig, PODMembershipLists } from "@pcd/gpc";
import { POD_INT_MIN, POD_INT_MAX, PODValue } from "@pcd/pod";

// This proof request specifies what we want to prove, which can be sent to the
// prover to request a proof.
// Once we get the proof, verifier can check whether the proof is valid based on
// this proof request.
export type ProofRequest = {
  proofConfig: GPCProofConfig;
  membershipLists: PODMembershipLists;
  externalNullifier: PODValue;
  watermark: PODValue;
};

const getDates = () => {
  const now = new Date();
  const eighteenYearsAgo = now;
  eighteenYearsAgo.setFullYear(now.getFullYear() - 18);
  return {
    now,
    eightYearsAgo: eighteenYearsAgo
  };
};

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
        // Prove the presence of an entry called "dateOfBirth", hide its value.
        // and prove that it is <= the timestamp of eight years ago from now.
        dateOfBirth: {
          isRevealed: false,
          inRange: {
            min: POD_INT_MIN,
            max: BigInt(getDates().eightYearsAgo.getTime())
          }
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

// We can optionally ask to generate a nullifier, which is tied to the user's
// identity and to the external nullifier value here. This can be used
// to identify duplicate proofs without de-anonymizing.
const externalNullifier: PODValue = { type: "string", value: "ZooKyc" };

// Watermark will be included in the resulting proof. It allows identifying a proof as tied
// to a specific use case to avoid reuse.
// Here we use the current timestamp. Also because it is good to know when this proof request
// is created. Since in the proof config, we are checking the govID POD dateOfBirth entry is
// <= the timestamp of eight years ago from the current timestamp.
const watermark: PODValue = {
  type: "string",
  value: getDates().now.toISOString()
};

export const proofRequest: ProofRequest = {
  proofConfig,
  membershipLists,
  externalNullifier,
  watermark
};
