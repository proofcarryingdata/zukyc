import { useLocalStorage } from "usehooks-ts";

const useAuthToken = (site: string) => {
  const [token, setToken] = useLocalStorage(`${site}Token`, "");

  return { token, setToken };
};

export default useAuthToken;
