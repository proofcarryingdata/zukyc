"use client";

import { useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useIssuePaystubPOD } from "@/deel/hooks/useIssuePaystubPOD";
import Login from "@/shared/components/Login";
import { useLogin } from "@/shared/hooks/useLogin";
import useAuthToken from "@/shared/hooks/useAuthToken";

export default function Deel() {
  const { token } = useAuthToken("deel");
  const { mutate: login, error: loginError } = useLogin("deel");

  const onLogin = useCallback(
    (data: FieldValues) => {
      login({ email: data.email, password: data.password });
    },
    [login]
  );

  const {
    mutate: issuePaystubPOD,
    isSuccess,
    data,
    error
  } = useIssuePaystubPOD();
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

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooDeel</h1>
      <h2 className="text-lg font-bold">Paystub POD issuer</h2>

      {!token && <Login onLogin={onLogin} />}
      {loginError && (
        <p className="font-bold text-red-500">{`Error login: ${loginError.message}`}</p>
      )}

      {token && !isSuccess && (
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

      {isSuccess && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your Paystub POD</h2>
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
