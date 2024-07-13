"use client";

import { useCallback, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import {
  issueDebugIDPOD,
  IIssueDebugIDPODResponse
} from "@/debug/util/issueDebugIDPOD";

export default function IDPOD() {
  const [response, setResponse] = useState<IIssueDebugIDPODResponse>();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const issueIDPOD = useCallback((data: FieldValues) => {
    // TODO: check DOB range, check semaphoreCommitment format
    issueDebugIDPOD(
      {
        idNumber: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        semaphoreCommitment: data.semaphoreCommitment
      },
      setResponse
    );
  }, []);

  return (
    <div className="flex flex-col gap-2 grow">
      <h2 className="text-lg font-bold">Issue ID POD</h2>
      <form
        onSubmit={handleSubmit((data) => issueIDPOD(data))}
        className="flex flex-col gap-2"
      >
        <input
          {...register("id", {
            required: true,
            pattern: {
              value: /[A-Z][0-9]{7}/,
              message: "Entered value does not match ID number format"
            }
          })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Driver's license or ID card number"
        />
        {errors.id && (
          <p className="text-red-500">
            {(errors.id.message as string) || "ID number is required."}
          </p>
        )}

        <input
          {...register("firstName", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="First name"
        />
        {errors.firstName && (
          <p className="text-red-500">First name is required.</p>
        )}

        <input
          {...register("lastName", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Last name"
        />
        {errors.lastName && (
          <p className="text-red-500">Last name is required.</p>
        )}

        <div className="form-group flex gap-20 items-center">
          <label htmlFor="age">Age</label>
          <input
            {...register("age", { required: true })}
            type="number"
            className="form-input px-4 py-3 rounded grow"
          />
          {errors.age && <p className="text-red-500">Age is required.</p>}
        </div>

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
          value="Issue ID POD"
        />
      </form>

      {response?.success && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 gap-1 items-center">
            <h2 className="text-lg">Here is your ID POD</h2>
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
    </div>
  );
}
