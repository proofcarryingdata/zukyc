import { useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity";

const useIdentity = () => {
  const [identity, setIdentity] = useState<Identity>();

  useEffect(() => {
    const privatekey = localStorage.getItem("semaphorePrivateKey");
    if (privatekey) {
      setIdentity(Identity.import(privatekey));
    } else {
      // generate new identity
      const id = new Identity();
      setIdentity(id);
      localStorage.setItem("semaphorePrivateKey", id.export());
    }
  }, []);

  return identity;
};

export default useIdentity;
