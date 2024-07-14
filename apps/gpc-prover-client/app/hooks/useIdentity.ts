import { useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity";

const useIdentity = () => {
  const [identity, setIdentity] = useState<Identity>();

  useEffect(() => {
    const id = localStorage.getItem("semaphoreID");
    if (id) {
      setIdentity(new Identity(id));
    } else {
      // generate new identity
      const id = new Identity();
      setIdentity(id);
      localStorage.setItem("semaphoreID", id.toString());
    }
  }, [setIdentity]);

  return identity;
};

export default useIdentity;
