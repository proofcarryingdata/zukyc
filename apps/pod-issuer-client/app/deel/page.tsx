"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import {
  issuePaystubPOD,
  IissuePaystubPODResponse
} from "@/deel/util/issuePaystubPOD";
import Login from "@/shared/components/Login";

export default function Deel() {
  const [user, setUser] = useState<string | undefined>();
  const [response, setResponse] = useState<IissuePaystubPODResponse>();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const login = useCallback((data: FieldValues) => {
    // For demo purposes, only allow DEMO_EMAIL and DEMO_PASSWORD
    // TODO: verify on server
    // if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
    //   setUser(data.email);
    //   localStorage.setItem("user", data.email);
    //   return;
    // }
    // alert("Incorrect email and password. Please try again.");
  }, []);

  const issuePOD = useCallback((data: FieldValues) => {
    issuePaystubPOD(
      {
        semaphoreCommitment: data.semaphoreCommitment
      },
      setResponse
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <main className="p-6 m-0 flex flex-col gap-4">
      <h1 className="text-xl font-bold">ZooDeel</h1>
      <h2 className="text-lg font-bold">Paystub POD issuer</h2>

      {typeof user === "undefined" && <Login onLogin={login} />}

      {/*TODO: display user name, organization */}

      {typeof user !== "undefined" && !response?.success && (
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
              required: true,
              pattern: {
                value: /\d+/,
                message:
                  "Entered value does not match semaphore commitment format"
              }
            })}
            type="text"
            className="form-input px-4 py-3 rounded"
            placeholder="Public identifier (Semaphore identity commiment)"
          />
          {errors.semaphoreCommitment && (
            <p className="text-red-500">
              {(errors.semaphoreCommitment.message as string) ||
                "Public identifier is required."}
            </p>
          )}

          <input
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
            value="Issue Paystub POD"
          />
        </form>
      )}

      {response?.success && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your Paystub POD</h2>
            <button
              className="p-2 m-1 text-sm bg-transparent border-none hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(response?.serializedPOD);
              }}
            >
              📋
            </button>
          </div>

          <textarea
            className="border-none"
            readOnly
            rows={10}
            value={response?.serializedPOD}
          />
        </div>
      )}

      {response?.error && (
        <p className="font-bold text-red-500">{response?.error}</p>
      )}
    </main>
  );
}
