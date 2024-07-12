import { Dispatch } from "react";
import { POD } from "@pcd/pod";
import {
  GPCProofInputs,
  deserializeGPCProofConfig,
  gpcArtifactDownloadURL,
  gpcProve,
  serializeGPCBoundConfig,
  serializeGPCRevealedClaims
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

export type ProofResult = {
  circuitIdentifier: string;
  proof: string;
  claims: string;
};

// TODO: use Paystub pod
export const generateProof = async (
  identity: Identity,
  serializedIDPOD: string,
  serializedPaystubPOD: string,
  serializedProofConfig: string,
  setProofResult: Dispatch<ProofResult>
) => {
  try {
    if (!serializedIDPOD) {
      throw new Error("ID POD field cannot be empty!");
    }

    const idPOD = POD.deserialize(serializedIDPOD);
    const paytsubPOD = POD.deserialize(serializedPaystubPOD);

    const proofConfig = deserializeGPCProofConfig(serializedProofConfig);

    // To generate a proof I need to pair a config with a set of inputs, including
    // the POD(s) to prove about.  Inputs can also enable extra security features
    // of the proof.
    const proofInputs: GPCProofInputs = {
      pods: {
        // The name "govID" here matches this POD with the config above.
        govID: idPOD
        // paystub: paytsubPOD
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

    console.log(serializeGPCBoundConfig(boundConfig));
    const serializedProof = {
      circuitIdentifier: boundConfig.circuitIdentifier,
      proof: JSON.stringify(proof),
      claims: serializeGPCRevealedClaims(revealedClaims)
    };
    setProofResult(serializedProof);
  } catch (e) {
    alert("Error generate proof");
    console.log(JSON.stringify(e));
  }
};

export default generateProof;
