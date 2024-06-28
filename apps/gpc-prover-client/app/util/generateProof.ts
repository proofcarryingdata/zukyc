import { Dispatch } from "react";
import { POD } from "@pcd/pod";
import {
  GPCProofConfig,
  GPCProofInputs,
  gpcArtifactDownloadURL,
  gpcProve,
  serializeGPCBoundConfig,
  serializeGPCRevealedClaims
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

export type ProofResult = {
  proof: string;
  config: string;
  claims: string;
};

// TODO: use Paystub pod
export const generateProof = async (
  serializedIDPOD: string,
  identity: Identity,
  setProofResult: Dispatch<ProofResult>
) => {
  try {
    if (!serializedIDPOD) {
      throw new Error("ID POD field cannot be empty!");
    }

    const idPOD = POD.deserialize(serializedIDPOD);

    // A GPCConfig specifies what we want to prove about one or more PODs.  It's
    // intended to be reusable to generate multiple proofs.
    const proofConfig: GPCProofConfig = {
      pods: {
        id: {
          entries: {
            // prove the presence of an entry called "age" and hide its value.
            age: { isRevealed: false },
            // Prove the presence of an entry called "owner". I'm not
            // revealing it, but will be proving I own the corresponding
            // Semaphore identity secrets.
            owner: { isRevealed: false, isOwnerID: true }
          }
        }
      }
    };

    // To generate a proof I need to pair a config with a set of inputs, including
    // the POD(s) to prove about.  Inputs can also enable extra security features
    // of the proof.
    const proofInputs: GPCProofInputs = {
      pods: {
        // The name "id" here matches this POD with the config above.
        id: idPOD
      },
      owner: {
        // Here I provide my private identity info.  It's never revealed in the
        // proof, but used to prove the correctness of the `owner` entry as
        // specified in the config.
        // Note: we have to use "@semaphore-protocol/identity": "^3.15.2",
        // the most recent version changed the semphoreIdentity definition.
        semaphoreV3: identity,
        // I can optionally ask to generate a nullifier, which is tied to my
        // identity and to the external nullifier value here.  This can be used
        // to avoid exploits like double-voting.
        externalNullifier: { type: "string", value: "attack round 3" }
      },
      // Watermark gets carried in the proof and can be used to ensure the same
      // proof isn't reused outside of its intended context.  A timestamp is
      // one possible way to do that.
      watermark: { type: "int", value: BigInt(Date.now()) }
    };

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const { proof, boundConfig, revealedClaims } = await gpcProve(
      proofConfig,
      proofInputs,
      artifactsURL
    );

    const serializedProof = {
      proof: JSON.stringify(proof),
      config: serializeGPCBoundConfig(boundConfig),
      claims: serializeGPCRevealedClaims(revealedClaims)
    };
    setProofResult(serializedProof);
  } catch (e) {
    alert(e);
  }
};

export default generateProof;
