import { useMemo } from "react";
import Chance from "chance";
import useStore from "@/shared/hooks/useStore";

// Generate random login credentials for demo purposes
// We reuse the same email for "gov" and "deel" websites.
// On the server side, they generate the same firstName and lastName for the same email.
// Our proof will check we have the same firstName and lastName for ID POD and paystub POD.
// In practice, need to implement sign up process
const useLoginCreds = () => {
  const email = useStore((state) => state.email);

  return useMemo(() => {
    const chance = new Chance();

    let loginEmail = email;
    if (!loginEmail) {
      const animal = chance.animal().replace(/'| /g, "");
      const names = animal.split(" ");
      if (names.length < 2) {
        names.push(chance.last());
      }
      const name = names.join(".").toLowerCase();
      loginEmail = `${name}@zoo.com`;
    }

    return {
      email: loginEmail,
      password: `zoo${chance.string({ length: 6 })}`
    };
  }, [email]);
};

export default useLoginCreds;
