import JSONBig from "json-bigint";
import _ from "lodash";
import { GPCBoundConfig, gpcArtifactDownloadURL, gpcVerify } from "@pcd/gpc";
import { ProofRequest } from "@/util/proofRequest";
import { tryRecordNullifierHash } from "@/util/persistence";

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const verifyProof = async (
  proofRequest: ProofRequest,
  proofRequestBoundConfig: GPCBoundConfig,
  proofStr: string
) => {
  if (!proofStr) {
    throw new Error("Proof cannot be empty!");
  }

  // You can also use deserializeGPCBoundConfig to deserialize the boundConfig,
  // and use deserializeGPCRevealedClaims to deserialize the revealedClaims,
  // and underlyingly they use json-bigint like we do here.
  // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCBoundConfig.html
  // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCRevealedClaims.html
  const proofObj = jsonBigSerializer.parse(proofStr);

  // We need to make sure the proof is generated with the proofConfig provided in
  // our proofRequest. So here we force the verifier to use the bound proofConfig in our proofRequest
  // as part of the boundConfig, with the understanding that it will force the verification to fail
  // if this boundConfig is not the one used to generate the proof.
  // Note that gpcBindConfig might not always pick the same circuit as gpcProve, since it doesn't know
  // the size of the inputs. so here we would like to use the circuitIdentifier returned by gpcProve.
  const vConfig = {
    ...proofRequestBoundConfig,
    circuitIdentifier: proofObj.boundConfig.circuitIdentifier
  };

  // We need to make sure the proof is generated with the membershipLists provided in our proofRequest.
  // So here we force the verifier to use the membershipLists in our proofRequest as part of the
  // revealed claims, with the understanding that it will force the verification to fail
  // if this membershipLists is not the one used to generate the proof.
  const vClaims = {
    ...proofObj.revealedClaims,
    membershipLists: proofRequest.membershipLists
  };

  // We need a URL for downloading GPC artifacts depending on the configuration in the browser.
  // https://docs.pcd.team/functions/_pcd_gpc.gpcArtifactDownloadURL.html
  const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
  console.log("download artifacts from", artifactsURL);

  // This is the core functionality which verifies the proof produced by gpcProve.
  // https://docs.pcd.team/functions/_pcd_gpc.gpcVerify.html
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
  // We still need to check that revealed claims are as expected.

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
  if (!_.isEqual(vClaims.watermark, proofRequest.watermark)) {
    throw new Error("Watermark does not match");
  }

  // Checks the nullifer, we don't want the same user to get more than one loan.
  if (
    !_.isEqual(vClaims.owner?.externalNullifier, proofRequest.externalNullifier)
  ) {
    throw new Error(
      `Invalid external nullifier value, make sure it is ${proofRequest.externalNullifier}`
    );
  }
  // This check has side-effects (recording the nullifierHash which indicates that the
  // user got a loan). Therefore it should be the last thing to happen after all the
  // other checks are successful.
  if (!(await tryRecordNullifierHash(vClaims.owner?.nullifierHash))) {
    throw new Error(
      `Your proof is valid. But we've got a proof from you before. You cannot get more than one loan. See ${window.location.origin}/debug.`
    );
  }

  return true;
};

export default verifyProof;
