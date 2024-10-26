import { useEffect, useState } from "react";
import { Identity } from "semaphore-identity-v4";

const useIdentity = () => {
  const [identity, setIdentity] = useState<Identity>();

  useEffect(() => {
    const privatekey = localStorage.getItem("semaphoreID");
    if (privatekey) {
      setIdentity(Identity.import(privatekey));
    } else {
      // generate new identity
      const id = new Identity();
      setIdentity(id);
      localStorage.setItem("semaphoreID", id.export());
    }
  }, []);

  return identity;
};

export default useIdentity;
