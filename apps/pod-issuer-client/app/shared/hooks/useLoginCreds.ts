import { useMemo } from "react";
import Chance from "chance";
import useStore from "@/shared/hooks/useStore";

// Generate random login credentials for demo purposes
// In practice, need to implement sign up process
const useLoginCreds = () => {
  const email = useStore((state) => state.email);

  return useMemo(() => {
    const chance = new Chance();

    console.log(email);
    let loginEmail = email;
    if (!loginEmail) {
      let animal = chance.animal({ type: "zoo" }).replaceAll("'", "");
      animal = animal.split(" ").join(".").toLowerCase();
      loginEmail = `${animal}@zoo.com`;
    }

    return {
      email: loginEmail,
      password: `zoo${chance.string({ length: 6 })}`
    };
  }, [email]);
};

export default useLoginCreds;
