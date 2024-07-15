import { useMutation } from "@tanstack/react-query";
import useAuthToken from "@/shared/hooks/useAuthToken";

const login = async (site: string, args: ILoginArgs) => {
  if (!process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL)
    throw new Error("NEXT_PUBLIC_POD_ISSUER_SERVER_URL not set");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL}/${site}/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args })
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const token = await response.text();
  return token;
};

export const useLogin = (site: string) => {
  const { setToken } = useAuthToken(site);

  return useMutation({
    mutationKey: ["login", site],
    mutationFn: async (args: ILoginArgs) => {
      return login(site, args);
    },
    onSuccess: (token) => {
      setToken(token);
    },
    onError: () => {
      setToken("");
    }
  });
};

export interface ILoginArgs {
  email: string;
  password: string;
}
