import { Dispatch } from "react";
import {
  GPCBoundConfig,
  GPCProof,
  gpcArtifactDownloadURL,
  gpcVerify,
  deserializeGPCBoundConfig,
  deserializeGPCRevealedClaims,
  PODMembershipLists
} from "@pcd/gpc";

export const verifyProof = async (
  boundConfig: GPCBoundConfig,
  membershipLists: PODMembershipLists,
  proofStr: string,
  setVerified: Dispatch<boolean>
) => {
  try {
    if (!proofStr) {
      throw new Error("Proof cannot be empty!");
    }

    const proofObj = JSON.parse(proofStr);
    const vProof = JSON.parse(proofObj.proof) as GPCProof;

    // Use the boundConfig we provided.
    // However, gpcBindConfig might not always pick the same circuit as gpcProve,
    // since it doesn't know the size of the inputs.
    // Here we would like to use the circuitIdentifier returned by gpcProve.
    const vConfig = {
      ...boundConfig,
      circuitIdentifier: deserializeGPCBoundConfig(proofObj.config)
        .circuitIdentifier
    };

    // Make sure the membershipLists in the revealed claims matches
    // the lists we provided.
    const vClaims = {
      ...deserializeGPCRevealedClaims(proofObj.claims),
      membershipLists
    };

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const isValid = await gpcVerify(vProof, vConfig, vClaims, artifactsURL);
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
      vClaims.pods.paystub?.signerPublicKey !==
      process.env.NEXT_PUBLIC_DEEL_EDDSA_PUBLIC_KEY
    ) {
      throw new Error("Please make sure your ID POD is signed by ZooDeel");
    }

    // Do more checks with the revealed claims
    if (
      vClaims.pods.govID?.entries?.firstName?.value !==
      vClaims.pods.paystub?.entries?.firstName?.value
    ) {
      throw new Error(
        "The firstName in ID POD doesn't match the firstName in Paystub POD"
      );
    }

    const oneYearAfter = new Date(
      vClaims.pods.paystub?.entries?.startDate?.value as string
    );
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    if (oneYearAfter > new Date()) {
      throw new Error(
        "You haven't been with your current employer for at least a year"
      );
    }

    setVerified(isValid);
  } catch (e) {
    alert(e);
  }
};

export default verifyProof;
