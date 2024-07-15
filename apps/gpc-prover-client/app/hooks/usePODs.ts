import { useLocalStorage } from "usehooks-ts";

const usePODs = () => {
  const [idPODStr, setIdPODStr] = useLocalStorage("idPOD", "");
  const [paystubPODStr, setPaystubPODStr] = useLocalStorage("paystubPOD", "");

  return {
    idPODStr,
    setIdPODStr,
    paystubPODStr,
    setPaystubPODStr
  };
};

export default usePODs;
