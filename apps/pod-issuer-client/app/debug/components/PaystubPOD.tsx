"use client";

import { useCallback, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import {
  issueDebugPaystubPOD,
  IissueDebugPaystubPODResponse
} from "@/debug/util/issueDebugPaystubPOD";

export default function PaystubPOD() {
  const [response, setResponse] = useState<IissueDebugPaystubPODResponse>();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const issuePaystubPOD = useCallback((data: FieldValues) => {
    // TODO: check start dates in range
    issueDebugPaystubPOD(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        currentEmployer: data.currentEmployer,
        startDate: data.startDate,
        annualSalary: parseInt(data.annualSalary),
        semaphoreCommitment: data.semaphoreCommitment
      },
      setResponse
    );
  }, []);

  return (
    <div className="flex flex-col gap-2 grow">
      <h2 className="text-lg font-bold">Issue Paystub POD</h2>
      <form
        onSubmit={handleSubmit((data) => issuePaystubPOD(data))}
        className="flex flex-col gap-2"
      >
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

        <input
          {...register("currentEmployer", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Current employer"
        />
        {errors.currentEmployer && (
          <p className="text-red-500">Current employer is required.</p>
        )}

        <div className="form-group flex gap-20 items-center">
          <label htmlFor="startDate">Start date</label>
          <input
            {...register("startDate", { required: true })}
            type="date"
            className="form-input px-4 py-3 rounded grow"
          />
          {errors.startDate && (
            <p className="text-red-500">Start date is required.</p>
          )}
        </div>

        <div className="form-group flex gap-3 items-center justify-between">
          <label htmlFor="annualSalary">Annual salary</label>
          <Controller
            name="annualSalary"
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, onChange } }) => (
              <NumericFormat
                thousandSeparator=","
                prefix="$ "
                decimalScale={0}
                getInputRef={ref}
                onValueChange={(values) => {
                  onChange(values.floatValue);
                }}
              />
            )}
          />
          {errors.annualSalary && (
            <p className="text-red-500">Annual salary is required.</p>
          )}
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
          value="Issue Paystub POD"
        />
      </form>

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
    </div>
  );
}
