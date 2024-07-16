import { useMutation } from "@tanstack/react-query";
import useStore from "@/shared/hooks/useStore";
import { login, ILoginArgs } from "@/shared/queries/login";

const useLogin = () => {
  const setGovToken = useStore((state) => state.setGovToken);

  return useMutation({
    mutationKey: ["govLogin"],
    mutationFn: async (args: ILoginArgs) => {
      return login("gov", args);
    },
    onSuccess: (token) => {
      setGovToken(token);
    },
    onError: () => {
      setGovToken(null);
    }
  });
};

export default useLogin;
