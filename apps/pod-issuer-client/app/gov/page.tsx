"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useIssueIDPOD } from "@/gov/hooks/useIssueIDPOD";
import InfoForm from "@/gov/components/InfoForm";
import Login from "@/shared/components/Login";

export default function Gov() {
  const [user, setUser] = useState<string | undefined>();

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
    // setUser(data.email);
    // localStorage.setItem("user", data.email);
    // return;
    // //}
    // alert("Incorrect email and password. Please try again.");
  }, []);

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

      {typeof user === "undefined" && <Login onLogin={login} />}

      {typeof user !== "undefined" && !isSuccess && (
        <InfoForm onSubmitInfo={issuePOD} />
      )}

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
