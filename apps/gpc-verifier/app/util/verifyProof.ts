import { Dispatch } from "react";
import {
  GPCProof,
  gpcArtifactDownloadURL,
  gpcVerify,
  deserializeGPCBoundConfig,
  deserializeGPCRevealedClaims
} from "@pcd/gpc";

export const verifyProof = async (
  proofStr: string,
  setVerified: Dispatch<boolean>
) => {
  try {
    if (!proofStr) {
      throw new Error("Proof cannot be empty!");
    }

    const proofObj = JSON.parse(proofStr);
    const vProof = proofObj.proof as GPCProof;
    const vConfig = deserializeGPCBoundConfig(proofObj.config);
    const vClaims = deserializeGPCRevealedClaims(proofObj.claims);

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const isValid = await gpcVerify(vProof, vConfig, vClaims, artifactsURL);
    if (!isValid) {
      throw new Error("Your proof is not valid. Please try again.");
    }

    // TODO: more checking needs to be done here

    setVerified(isValid);
  } catch (e) {
    alert(e);
  }
};

export default verifyProof;
