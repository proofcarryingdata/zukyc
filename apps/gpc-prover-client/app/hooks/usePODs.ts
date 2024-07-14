import { useLocalStorage } from "usehooks-ts";

const usePODs = () => {
  const idPODKey = "idPOD";
  const paystubPODKey = "paystubPOD";

  const [idPODStr, setIdPODStr] = useLocalStorage(idPODKey, "");
  const [paystubPODStr, setPaystubPODStr] = useLocalStorage(paystubPODKey, "");

  return {
    idPODStr,
    setIdPODStr,
    paystubPODStr,
    setPaystubPODStr
  };
};

export default usePODs;
