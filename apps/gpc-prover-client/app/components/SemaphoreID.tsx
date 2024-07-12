import { Tooltip } from "react-tooltip";
import useIdentity from "@/util/useIdentity";

const SemaphoreID = () => {
  const { identity, newIdentity } = useIdentity();

  return (
    <div className="flex flex-col gap-2 p-4 border rounded border-slate-400">
      <div className="flex flex-1 gap-1 items-center">
        <h2 className="text-lg font-bold">Identity</h2>
        <p className="title-tooltip-anchor">❗</p>
        <Tooltip anchorSelect=".title-tooltip-anchor">
          We use Semaphore V3. GPC proofs checks POD ownership via Semaphore V3
          by default.
        </Tooltip>
      </div>
      <p className="text-sm">This is used to prove PODs ownership.</p>

      <div className="flex flex-col">
        <div className="flex flex-1 gap-1 items-center">
          <span>Public identifier</span>
          <span className="text-sm">
            (You can use this as the public identifier when requesting PODs on
            ZooGov or ZooDeel.)
          </span>
          {identity && (
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(identity?.commitment.toString());
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
          value={identity?.commitment.toString()}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-1 gap-1 items-center">
          <span>Private secret</span>
          <span className="text-sm">(Please keep it safe)</span>
          {identity && (
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(identity?.toString());
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
          value={identity?.toString()}
        />
      </div>

      <div>
        <button onClick={newIdentity}>Generate New Identity</button>
      </div>
    </div>
  );
};

export default SemaphoreID;
