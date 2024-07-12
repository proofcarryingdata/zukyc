import usePODs from "@/hooks/usePODs";

const PODs = () => {
  const {
    idPODStr,
    setIDPODStr,
    saveIDPOD,
    paystubPODStr,
    setPaystubPODStr,
    savePaystubPOD
  } = usePODs();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded border-slate-400">
      <h2 className="text-lg font-bold">PODs</h2>
      <p className="text-sm">
        You'll need ID POD and Paystub POD as inputs for your proof.
      </p>
      <div className="flex flex-col gap-2">
        <span>
          Get your ID POD from{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_POD_ISSUER_CLIENT_URL}/gov`}
            className="text-blue-500"
            target="_blank"
          >
            ZooGov
          </a>
        </span>
        <textarea
          rows={10}
          value={idPODStr}
          placeholder="Past your ID POD here!"
          onChange={(e) => setIDPODStr(e.target.value.trim())}
        />
        <div>
          <button onClick={saveIDPOD}>Save ID POD</button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span>
          Get your Paystub POD from{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_POD_ISSUER_CLIENT_URL}/deel`}
            className="text-blue-500"
            target="_blank"
          >
            ZooDeel
          </a>
        </span>
        <textarea
          rows={10}
          value={paystubPODStr}
          placeholder="Past your Paystub POD here!"
          onChange={(e) => setPaystubPODStr(e.target.value.trim())}
        />
        <div>
          <button onClick={savePaystubPOD}>Save Paystub POD</button>
        </div>
      </div>
    </div>
  );
};

export default PODs;
