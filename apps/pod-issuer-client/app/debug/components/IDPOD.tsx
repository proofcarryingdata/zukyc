"use client";

import { useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useIssueDebugIDPOD } from "@/debug/hooks/useIssueDebugIDPOD";

export default function IDPOD() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const {
    mutate: issueDebugIDPOD,
    isSuccess,
    data,
    error
  } = useIssueDebugIDPOD();

  const issueIDPOD = useCallback(
    (data: FieldValues) => {
      issueDebugIDPOD({
        idNumber: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth).getTime(),
        semaphoreCommitment: data.semaphoreCommitment
      });
    },
    [issueDebugIDPOD]
  );

  return (
    <div className="flex flex-col gap-2 grow">
      <h2 className="text-lg font-bold">Issue ID POD</h2>
      <form
        onSubmit={handleSubmit((data) => issueIDPOD(data))}
        className="flex flex-col gap-2"
      >
        <input
          {...register("id", {
            required: "This is required.",
            pattern: {
              value: /^[A-Z][0-9]{7}$/,
              message:
                "Entered value does not match ID number format /^[A-Z][0-9]{7}$/."
            }
          })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Driver's license or ID card number"
        />
        {errors.id && (
          <p className="text-red-500">{errors.id.message as string}</p>
        )}

        <input
          {...register("firstName", { required: "This is required" })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="First name"
        />
        {errors.firstName && (
          <p className="text-red-500">{errors.firstName.message as string}</p>
        )}

        <input
          {...register("lastName", { required: "This is required" })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Last name"
        />
        {errors.lastName && (
          <p className="text-red-500">{errors.lastName.message as string}</p>
        )}

        <div className="form-group flex gap-20 items-center">
          <label htmlFor="dateOfBirth">Date of birth</label>
          <input
            {...register("dateOfBirth", {
              required: "This is required.",
              valueAsDate: true,
              validate: {
                beforeToday: (v) => v < new Date()
              }
            })}
            type="date"
            className="form-input px-4 py-3 rounded grow"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500">
              {(errors.dateOfBirth.message as string) ||
                "Date of birth cannot be a future date."}
            </p>
          )}
        </div>

        <input
          {...register("semaphoreCommitment", {
            required: "This is required.",
            pattern: {
              value: /\d+/,
              message: "Entered value should be bigint."
            }
          })}
          type="number"
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
          value="Issue ID POD"
        />
      </form>

      {isSuccess && (
        <div className="flex flex-col gap-2">
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
    </div>
  );
}
