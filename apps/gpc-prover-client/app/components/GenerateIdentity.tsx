import { useState } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { bufferToHexadecimal, crypto } from "@zk-kit/utils";

const GenerateIdentity = () => {
  const [identity, setIdentity] = useState<Identity>();

  const newIdentity = () => {
    // GPC proofs checks POD ownership via Semaphore V3 by default.
    // This line creates a new private identity.
    const id = new Identity(bufferToHexadecimal(crypto.getRandomValues(32)));
    setIdentity(id);
  };

  return (
    <div>
      <button onClick={newIdentity}>Generate New Identity</button>
      <div className="flex flex-col">
        <span>
          This is your private identity secret (Semaphore private identity),
          please keep it safe
        </span>
        <textarea
          className="border-none"
          readOnly
          rows={1}
          value={identity?.toString()}
        />
      </div>

      <div className="flex flex-col">
        <span>
          This is your public identifier (Semaphore identity commitment), you
          can use it at govement or deel websites to generate PODs
        </span>
        <textarea
          className="border-none"
          readOnly
          rows={1}
          value={identity?.commitment.toString()}
        />
      </div>
    </div>
  );
};

export default GenerateIdentity;
