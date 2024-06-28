import { POD } from "@pcd/pod";
import {
  GPCProofConfig,
  GPCProofInputs,
  gpcArtifactDownloadURL,
  gpcProve
} from "@pcd/gpc";
import { Identity } from "@semaphore-protocol/identity";

const generateProof = async (serializedIDPOD: string) => {
  try {
    if (!serializedIDPOD) return;

    const idPOD = POD.deserialize(serializedIDPOD);

    const proofConfig: GPCProofConfig = {
      pods: {
        // I'm calling this POD "weapon", but that's an arbitray name assigned
        // in config, not cryptographically verified.
        id: {
          entries: {
            // I'm proving the presence of an entry called "age"
            // and hide its value.
            age: { isRevealed: false },
            // I'm proving the presence of an entry called "owner".  I'm not
            // revealing it, but will be proving I own the corresponding
            // Semaphore identity secrets.
            owner: { isRevealed: false, isOwnerID: true }
          }
        }
      }
    };

    // TODO: cannot generate like this.
    const semaphoreIdentity = new Identity(
      '["329061722381819402313027227353491409557029289040211387019699013780657641967", "99353161014976810914716773124042455250852206298527174581112949561812190422"]'
    );
    console.log(semaphoreIdentity.commitment);

    const proofInputs: GPCProofInputs = {
      pods: {
        // The name "id" here matches this POD with the config above.
        id: idPOD
      },
      owner: {
        // Here I provide my private identity info.  It's never revealed in the
        // proof, but used to prove the correctness of the `owner` entry as
        // specified in the config.
        // Note: the most recent version of Identity type definition does not match here.
        semaphoreV3: semaphoreIdentity,
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
    console.log("In browser we'd download artifacts from", artifactsURL);
    const result = await gpcProve(proofConfig, proofInputs, artifactsURL);
    console.log(result.proof);
    console.log(result.boundConfig);
    console.log(result.revealedClaims);
    return result;
  } catch (e) {
    console.log(e);
  }
};

export default generateProof;
