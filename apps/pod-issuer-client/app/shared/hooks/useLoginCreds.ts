import { useMemo } from "react";
import Chance from "chance";

// Generate random login credentials for demo purposes
// In practice, need to implement sign up process
const useLoginCreds = () => {
  return useMemo(() => {
    const chance = new Chance();
    const animal = chance.animal({ type: "zoo" }).toLowerCase();
    return {
      email: `${animal}@zoo.com`,
      password: `zoo${chance.string({ length: 6 })}`
    };
  }, []);
};

export default useLoginCreds;
