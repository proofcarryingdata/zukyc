import { Tooltip } from "react-tooltip";
import useIdentity from "@/hooks/useIdentity";
import { encodePublicKey } from "@pcd/pod";

const SemaphoreID = () => {
  const identity = useIdentity();

  return (
    <div className="flex flex-col gap-2 p-4 border rounded border-slate-400">
      <div className="flex flex-1 gap-1 items-center">
        <h2 className="text-lg font-bold">Identity</h2>
        <p className="title-tooltip-anchor">❗</p>
        <Tooltip anchorSelect=".title-tooltip-anchor">
          We use Semaphore V4. GPC proofs checks POD ownership via Semaphore
          identity.
        </Tooltip>
      </div>
      <p className="text-sm">This is used to prove PODs ownership.</p>

      <div className="flex flex-col">
        <div className="flex flex-1 gap-1 items-center">
          <span>Public key</span>
          <span className="text-sm">
            (You can use this encoded public key when requesting PODs on ZooGov
            or ZooDeel.)
          </span>
          {identity && (
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(
                  encodePublicKey(identity.publicKey)
                );
              }}
            >
              📋
            </button>
          )}
        </div>
        <textarea
          className="border-none"
          readOnly
          rows={1}
          value={identity && encodePublicKey(identity.publicKey)}
          id="identity-commitment"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-1 gap-1 items-center">
          <span>Private key</span>
          <span className="text-sm">(Please keep it safe)</span>
          {identity && (
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(identity?.export());
              }}
            >
              📋
            </button>
          )}
        </div>
        <textarea
          className="border-none"
          readOnly
          rows={1}
          value={identity?.export()}
          id="identity"
        />
      </div>
    </div>
  );
};

export default SemaphoreID;
