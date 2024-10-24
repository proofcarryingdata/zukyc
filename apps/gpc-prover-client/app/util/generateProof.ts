import JSONBig from "json-bigint";
import { POD, PODValue } from "@pcd/pod";
import {
  gpcArtifactDownloadURL,
  gpcProve,
  GPCProofInputs,
  GPCProofConfig,
  PODMembershipLists,
  boundConfigToJSON,
  revealedClaimsToJSON
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

// Proof request specifies what we want to prove, which can be sent to the prover
// to request a proof.
export type ProofRequest = {
  proofConfig: GPCProofConfig;
  membershipLists: PODMembershipLists;
  externalNullifier: PODValue;
  watermark: PODValue;
};

const prove = async (
  identity: Identity,
  idPOD: POD,
  paystubPOD: POD,
  proofRequest: ProofRequest
) => {
  // https://docs.pcd.team/types/_pcd_gpc.GPCProofInputs.html
  // To generate a proof we need to pair the config with a set of inputs, including
  // the PODs to prove about. Inputs can also enable extra security features of the proof.
  const proofInputs: GPCProofInputs = {
    pods: {
      // The name "govID" here matches this POD with the config.
      govID: idPOD,
      // The name "paystub" here matches this POD with the config.
      paystub: paystubPOD
    },
    owner: {
      // The user's private identity info. It's never revealed in the
      // proof, but used to prove the correctness of the `owner` entry as
      // specified in the config.
      // Note: we have to use semaphoreV3, e.g. "@semaphore-protocol/identity": "^3.15.2",
      // the most recent version V4 changed the semphoreIdentity definition.
      semaphoreV3: identity,
      // We can optionally ask to generate a nullifier, which is tied to the user's
      // identity and to the external nullifier value here. This can be used
      // to identify duplicate proofs without de-anonymizing.
      // Here, We don't want the same user to get more than one loan.
      externalNullifier: proofRequest.externalNullifier
    },
    // Named lists of values for each list (non-)membership check.
    // The names assigned here are ussed to link these lists to their (non-)membership
    // checks in GPCProofEntryConfig.
    // In our case, this is for the isNotMemberOf check on govID POD idNumber entry in
    // our proofConfig.
    membershipLists: proofRequest.membershipLists,
    // If watermark is set, the given value will be included in the resulting
    // proof. This allows identifying a proof as tied to a specific use case, to
    // avoid reuse. Unlike a nullifier, this watermark is not cryptographically
    // tied to any specific input data. When the proof is verified, the watermark is also
    // verified (as a public input).
    watermark: proofRequest.watermark
  };

  // We need a URL for downloading GPC artifacts depending on the configuration in the browser.
  // https://docs.pcd.team/functions/_pcd_gpc.gpcArtifactDownloadURL.html
  const artifactsURL = gpcArtifactDownloadURL("unpkg", "prod", undefined);
  console.log("download artifacts from", artifactsURL);

  // This is the core functionality which generates the proof.
  // https://docs.pcd.team/functions/_pcd_gpc.gpcProve.html
  return await gpcProve(proofRequest.proofConfig, proofInputs, artifactsURL);
};

const jsonBigSerializer = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true
});

export const generateProof = async (
  identity: Identity,
  serializedIDPOD: string,
  serializedPaystubPOD: string,
  serializedProofRequest: string
) => {
  if (!serializedIDPOD) {
    throw new Error("ID POD field cannot be empty!");
  }
  if (!serializedPaystubPOD) {
    throw new Error("Paystub POD field cannot be empty!");
  }
  if (!serializedProofRequest) {
    throw new Error("Proof quest field cannot be empty!");
  }

  const idPOD = POD.fromJSON(JSON.parse(serializedIDPOD));
  const paystubPOD = POD.fromJSON(JSON.parse(serializedPaystubPOD));

  // You can also use deserializeGPCProofConfig to deserialize the proofConfig,
  // and underlyingly it uses json-bigint like what we are doing here.
  // https://docs.pcd.team/functions/_pcd_gpc.deserializeGPCProofConfig.html
  const proofRequest = jsonBigSerializer.parse(serializedProofRequest);

  const { proof, boundConfig, revealedClaims } = await prove(
    identity,
    idPOD,
    paystubPOD,
    proofRequest
  );

  return JSON.stringify(
    {
      proof: proof,
      boundConfig: boundConfigToJSON(boundConfig),
      revealedClaims: revealedClaimsToJSON(revealedClaims)
    },
    null,
    2
  );
};

export default generateProof;
