import { Dispatch } from "react";
import { POD } from "@pcd/pod";
import {
  GPCProofConfig,
  GPCProofInputs,
  GPCProof,
  gpcArtifactDownloadURL,
  gpcVerify,
  deserializeGPCBoundConfig,
  deserializeGPCRevealedClaims
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

export const verifyProof = async (
  proof: string,
  config: string,
  claims: string,
  setVerified: Dispatch<boolean>
) => {
  try {
    if (!proof || !config || !claims) {
      throw new Error("Proof, config, and claims cannot be empty!");
    }

    const vProof = JSON.parse(proof) as GPCProof;
    const vConfig = deserializeGPCBoundConfig(config);
    const vClaims = deserializeGPCRevealedClaims(claims);

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const isValid = await gpcVerify(vProof, vConfig, vClaims, artifactsURL);
    if (!isValid) {
      throw new Error("The proof is not valid. No 🐸!");
    }

    // TODO: more checking needs to be done here

    setVerified(isValid);
  } catch (e) {
    alert(e);
  }
};

export default verifyProof;
