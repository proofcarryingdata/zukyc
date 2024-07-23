"use client";

import { useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { FieldValues } from "react-hook-form";
import { useIssuePaystubPOD } from "@/deel/hooks/useIssuePaystubPOD";
import Login from "@/shared/components/Login";
import InfoForm from "@/deel/components/InfoForm";
import useLogin from "@/deel/hooks/useLogin";
import logout from "@/shared/hooks/logout";
import useStore from "@/shared/hooks/useStore";

export default function Deel() {
  const hasHydrated = useStore((state) => state._hasHydrated);

  const token = useStore((state) => state.deelToken);
  const paystubPOD = useStore((state) => state.paystubPOD);
  const semaphoreCommitment = useStore((state) => state.semaphoreCommitment);
  const setSemaphoreCommitment = useStore(
    (state) => state.setSemaphoreCommitment
  );

  const { mutate: login, error: loginError } = useLogin();
  const onLogin = useCallback(
    (data: FieldValues) => {
      login({ email: data.email, password: data.password });
    },
    [login]
  );

  const { mutate: issuePaystubPOD, error: issueError } = useIssuePaystubPOD();
  const issuePOD = useCallback(
    (data: FieldValues) => {
      if (!semaphoreCommitment) {
        setSemaphoreCommitment(data.semaphoreCommitment);
      }
      const commitment = semaphoreCommitment || data.semaphoreCommitment;
      issuePaystubPOD({
        semaphoreCommitment: commitment
      });
    },
    [semaphoreCommitment, setSemaphoreCommitment, issuePaystubPOD]
  );

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ZooDeel</h1>
        {token && <a onClick={logout}>Logout</a>}
      </div>

      <h2 className="text-lg font-bold">Paystub POD issuer</h2>

      {!token && <Login onLogin={onLogin} />}
      {loginError && (
        <p className="font-bold text-red-500">{`Error login: ${loginError.message}`}</p>
      )}

      {token && <InfoForm onSubmitInfo={issuePOD} />}

      {paystubPOD && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your Paystub POD</h2>
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(paystubPOD);
              }}
            >
              📋
            </button>
            <p className="info-tooltip-anchor">❗</p>
            <Tooltip anchorSelect=".info-tooltip-anchor">
              To generate Paystub PODs with different information, try{" "}
              {window.location.origin}/debug.
            </Tooltip>
          </div>

          <textarea
            className="border-none"
            readOnly
            rows={10}
            value={paystubPOD}
            id="paystub-pod"
          />
        </div>
      )}

      {issueError && (
        <p className="font-bold text-red-500">{issueError.message}</p>
      )}
    </main>
  );
}
