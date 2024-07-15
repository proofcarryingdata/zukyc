"use client";

import { useCallback } from "react";
import { FieldValues } from "react-hook-form";
import InfoForm from "@/gov/components/InfoForm";
import { useIssueIDPOD } from "@/gov/hooks/useIssueIDPOD";
import Login from "@/shared/components/Login";
import { useLogin } from "@/shared/hooks/useLogin";
import useAuthToken from "@/shared/hooks/useAuthToken";

export default function Gov() {
  const { token } = useAuthToken("gov");
  const { mutate: login, error: loginError } = useLogin("gov");

  const onLogin = useCallback(
    (data: FieldValues) => {
      login({ email: data.email, password: data.password });
    },
    [login]
  );

  const { mutate: issueIDPOD, isSuccess, data, error } = useIssueIDPOD();
  const issuePOD = useCallback(
    (data: FieldValues) => {
      issueIDPOD({
        semaphoreCommitment: data.semaphoreCommitment
      });
    },
    [issueIDPOD]
  );

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooGov</h1>
      <h2 className="text-lg font-bold">Govenment ID POD issuer</h2>

      {!token && <Login onLogin={onLogin} />}
      {loginError && (
        <p className="font-bold text-red-500">{`Error login: ${loginError.message}`}</p>
      )}

      {token && !isSuccess && <InfoForm onSubmitInfo={issuePOD} />}

      {isSuccess && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-green-500">
            We have successfully verified your information.
          </h2>

          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your ID POD</h2>
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(data);
              }}
            >
              📋
            </button>
          </div>

          <textarea className="border-none" readOnly rows={10} value={data} />
        </div>
      )}

      {error && <p className="font-bold text-red-500">{error.message}</p>}
    </main>
  );
}
