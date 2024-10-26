"use client";

import { useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { FieldValues } from "react-hook-form";
import InfoForm from "@/gov/components/InfoForm";
import { useIssueIDPOD } from "@/gov/hooks/useIssueIDPOD";
import Login from "@/shared/components/Login";
import useLogin from "@/gov/hooks/useLogin";
import logout from "@/shared/hooks/logout";
import useStore from "@/shared/hooks/useStore";

export default function Gov() {
  const hasHydrated = useStore((state) => state._hasHydrated);

  const token = useStore((state) => state.govToken);
  const idPOD = useStore((state) => state.idPOD);

  const { mutate: login, error: loginError } = useLogin();
  const onLogin = useCallback(
    (data: FieldValues) => {
      login({ email: data.email, password: data.password });
    },
    [login]
  );

  const { mutate: issueIDPOD, error: issueError } = useIssueIDPOD();
  const issuePOD = useCallback(
    (data: FieldValues) => {
      issueIDPOD({
        semaphorePublicKey: data.semaphorePublicKey
      });
    },
    [issueIDPOD]
  );

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ZooGov</h1>
        {token && <a onClick={logout}>Logout</a>}
      </div>

      <h2 className="text-lg font-bold">Govenment ID POD issuer</h2>

      {!token && <Login onLogin={onLogin} />}
      {loginError && (
        <p className="font-bold text-red-500">{`Error login: ${loginError.message}`}</p>
      )}

      {token && !idPOD && <InfoForm onSubmitInfo={issuePOD} />}

      {idPOD && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-green-500">
            We have successfully verified your information.
          </h2>

          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your ID POD</h2>
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(idPOD);
              }}
            >
              📋
            </button>
            <p className="info-tooltip-anchor">❗</p>
            <Tooltip anchorSelect=".info-tooltip-anchor">
              To generate ID PODs with different information, try{" "}
              {window.location.origin}/debug.
            </Tooltip>
          </div>

          <textarea
            className="border-none"
            readOnly
            rows={14}
            value={idPOD}
            id="id-pod"
          />
        </div>
      )}

      {issueError && (
        <p className="font-bold text-red-500">{issueError.message}</p>
      )}
    </main>
  );
}
