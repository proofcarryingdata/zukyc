"use client";

import { useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { useForm, FieldValues } from "react-hook-form";
import { useIssuePaystubPOD } from "@/deel/hooks/useIssuePaystubPOD";
import Login from "@/shared/components/Login";
import useLogin from "@/deel/hooks/useLogin";
import useStore from "@/shared/hooks/useStore";

export default function Deel() {
  const hasHydrated = useStore((state) => state._hasHydrated);

  const token = useStore((state) => state.deelToken);
  const paystubPOD = useStore((state) => state.paystubPOD);

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
      issuePaystubPOD({
        semaphoreCommitment: data.semaphoreCommitment
      });
    },
    [issuePaystubPOD]
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooDeel</h1>
      <h2 className="text-lg font-bold">Paystub POD issuer</h2>

      {!token && <Login onLogin={onLogin} />}
      {loginError && (
        <p className="font-bold text-red-500">{`Error login: ${loginError.message}`}</p>
      )}

      {token && !paystubPOD && (
        <form
          onSubmit={handleSubmit((data) => issuePOD(data))}
          className="flex flex-col gap-4"
        >
          <p className="text-lg">
            Please provide your public identifier (e.g.
            <a href="https://docs.semaphore.pse.dev/V3/guides/identities">
              Semaphore identity commitment
            </a>
            ). We'll issue your Paystub POD to this public identifier.
            <span className="info-tooltip-anchor">❗</span>
            <Tooltip anchorSelect=".info-tooltip-anchor">
              You can get this from{" "}
              {process.env.NEXT_PUBLIC_GPC_PROVER_CLIENT_URL}, see "Identity,
              Public identifier".
            </Tooltip>
          </p>
          <input
            {...register("semaphoreCommitment", {
              required: "This is required.",
              pattern: {
                value: /\d+/,
                message:
                  "Entered value does not match semaphore commitment format."
              }
            })}
            type="text"
            className="form-input px-4 py-3 rounded"
            placeholder="Public identifier (Semaphore identity commiment)"
          />
          {errors.semaphoreCommitment && (
            <p className="text-red-500">
              {errors.semaphoreCommitment.message as string}
            </p>
          )}

          <input
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
            value="Issue Paystub POD"
          />
        </form>
      )}

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
          />
        </div>
      )}

      {issueError && (
        <p className="font-bold text-red-500">{issueError.message}</p>
      )}
    </main>
  );
}
