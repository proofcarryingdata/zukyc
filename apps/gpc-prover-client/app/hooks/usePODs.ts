import { useCallback, useEffect, useState } from "react";

const usePODs = () => {
  const [idPODStr, setIDPODStr] = useState("");
  const [paystubPODStr, setPaystubPODStr] = useState("");

  useEffect(() => {
    const idPOD = localStorage.getItem("idPOD");
    const paystubPOD = localStorage.getItem("paystubPOD");
    if (idPOD) {
      setIDPODStr(idPOD);
    }
    if (paystubPOD) {
      setPaystubPODStr(paystubPOD);
    }
  }, [setIDPODStr, setPaystubPODStr]);

  const saveIDPOD = useCallback(() => {
    localStorage.setItem("idPOD", idPODStr);
  }, [idPODStr]);

  const savePaystubPOD = useCallback(() => {
    localStorage.setItem("paystubPOD", paystubPODStr);
  }, [paystubPODStr]);

  return {
    idPODStr,
    setIDPODStr,
    saveIDPOD,
    paystubPODStr,
    setPaystubPODStr,
    savePaystubPOD
  };
};

export default usePODs;
