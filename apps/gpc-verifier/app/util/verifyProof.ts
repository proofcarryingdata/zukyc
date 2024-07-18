import { Dispatch } from "react";
import JSONBig from "json-bigint";
import _ from "lodash";
import {
  GPCBoundConfig,
  gpcArtifactDownloadURL,
  gpcVerify,
  PODMembershipLists
} from "@pcd/gpc";
import { PODValue } from "@pcd/pod";
import { tryRecordNullifierHash } from "@/util/persistence";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const verifyProof = async (
  boundConfig: GPCBoundConfig,
  membershipLists: PODMembershipLists,
  externalNullifier: PODValue,
  watermark: PODValue,
  proofStr: string,
  setVerified: Dispatch<boolean>
) => {
  try {
    if (!proofStr) {
      throw new Error("Proof cannot be empty!");
    }

    // You can also use deserializeGPCBoundConfig to deserialize the boundConfig,
    // and use deserializeGPCRevealedClaims to deserialize the revealedClaims,
    // and underlyingly they use json-bigint like we do here.
    // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCBoundConfig.html
    // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCRevealedClaims.html
    const proofObj = jsonBigSerializer.parse(proofStr);

    // Use the boundConfig we provided.
    // However, gpcBindConfig might not always pick the same circuit as gpcProve,
    // since it doesn't know the size of the inputs.
    // Here we would like to use the circuitIdentifier returned by gpcProve.
    const vConfig = {
      ...boundConfig,
      circuitIdentifier: proofObj.boundConfig.circuitIdentifier
    };

    // Make sure the membershipLists in the revealed claims matches
    // the lists we provided.
    const vClaims = {
      ...proofObj.revealedClaims,
      membershipLists
    };

    const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
    console.log("download artifacts from", artifactsURL);

    const isValid = await gpcVerify(
      proofObj.proof,
      vConfig,
      vClaims,
      artifactsURL
    );
    if (!isValid) {
      throw new Error("Your proof is not valid. Please try again.");
    }

    // Note that `gpcVerify` only checks that the inputs are valid with respect to each other.
    // We still need to check that revealed values are as expected.

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

    // Checks the watermark, it should be what we passed in
    if (!_.isEqual(vClaims.watermark, watermark)) {
      throw new Error("Watermark does not match");
    }

    // Do more checks with the revealed claims
    const oneYearAfter = new Date(
      vClaims.pods.paystub?.entries?.startDate?.value as string
    );
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    if (oneYearAfter > new Date()) {
      throw new Error(
        "You haven't been with your current employer for at least a year"
      );
    }

    // Checks the nullifer, we don't want the same user to get more than one loan.
    if (!_.isEqual(vClaims.owner?.externalNullifier, externalNullifier)) {
      throw new Error(
        `Invalid external nullifier value, make sure it is ${externalNullifier}`
      );
    }
    // This check has side-effects (recording the nullifierHash which indicates that the
    // user got a loan). Therefore it should be the last thing to happen after all the
    // other checks are successful.
    if (!(await tryRecordNullifierHash(vClaims.owner?.nullifierHash))) {
      throw new Error(
        "We've got a proof from you before. You cannot get more than one loan."
      );
    }

    setVerified(isValid);
  } catch (e) {
    alert(e);
  }
};

export default verifyProof;
