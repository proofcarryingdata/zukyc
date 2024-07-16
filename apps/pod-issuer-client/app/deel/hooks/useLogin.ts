import { useMutation } from "@tanstack/react-query";
import useStore from "@/shared/hooks/useStore";
import { login, ILoginArgs } from "@/shared/queries/login";

const useLogin = () => {
  const setDeelToken = useStore((state) => state.setDeelToken);

  return useMutation({
    mutationKey: ["deelLogin"],
    mutationFn: async (args: ILoginArgs) => {
      return login("deel", args);
    },
    onSuccess: (token) => {
      setDeelToken(token);
    },
    onError: () => {
      setDeelToken("");
    }
  });
};

export default useLogin;
