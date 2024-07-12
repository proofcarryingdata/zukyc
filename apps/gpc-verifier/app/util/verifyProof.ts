import { Dispatch } from "react";
import {
  GPCProofConfig,
  GPCProof,
  gpcBindConfig,
  gpcArtifactDownloadURL,
  gpcVerify,
  deserializeGPCRevealedClaims
} from "@pcd/gpc";

export const verifyProof = async (
  config: GPCProofConfig,
  proofStr: string,
  setVerified: Dispatch<boolean>
) => {
  try {
    if (!proofStr) {
      throw new Error("Proof cannot be empty!");
    }

    const proofObj = JSON.parse(proofStr);

    // The config here has to be the same proof config as we provided.
    const { boundConfig } = gpcBindConfig(config);
    // The circuit identifier specifies the ZK circuit which was used to
    // generate the proof, and must also be used to verify the proof.
    boundConfig.circuitIdentifier = proofObj.circuitIdentifier;

    const vProof = JSON.parse(proofObj.proof) as GPCProof;
    const vClaims = deserializeGPCRevealedClaims(proofObj.claims);

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const isValid = await gpcVerify(vProof, boundConfig, vClaims, artifactsURL);
    if (!isValid) {
      throw new Error("Your proof is not valid. Please try again.");
    }

    // Check the PODs are signed by a trusted authorities with known public keys.
    if (
      vClaims.pods.govID?.signerPublicKey !==
      process.env.NEXT_PUBLIC_GOV_EDDSA_PUBLIC_KEY
    ) {
      throw new Error("Please make sure your ID POD is signed by ZooGov");
    }

    if (
      vClaims.pods.paystubPOD?.signerPublicKey !==
      process.env.NEXT_PUBLIC_DEEL_EDDSA_PUBLIC_KEY
    ) {
      throw new Error("Please make sure your ID POD is signed by ZooDeel");
    }

    // TODO: more checking needs to be done here

    setVerified(isValid);
  } catch (e) {
    alert(e);
  }
};

export default verifyProof;
