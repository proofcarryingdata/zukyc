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
    // TODO: check endDate after startDate, dates in range
    issueDebugPaystubPOD(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        employer: data.employer,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentFrequency: data.paymentFrequency,
        salary: data.salary.toString(),
        semaphoreCommitment: data.semaphoreCommitment
      },
      setResponse
    );
  }, []);

  return (
    <>
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
          {...register("employer", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Employer"
        />
        {errors.employer && (
          <p className="text-red-500">Employer is required.</p>
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

        <div className="form-group flex gap-3 items-center">
          <label htmlFor="endDate">End date (optional)</label>
          <input
            {...register("endDate")}
            type="date"
            className="form-input px-4 py-3 rounded grow"
          />
          {errors.endDate && <p className="text-red-500">Invalid end date.</p>}
        </div>

        <select
          {...register("paymentFrequency", { required: true })}
          className="form-input px-4 py-3 rounded"
          defaultValue=""
        >
          <option value="" disabled>
            Select payment frequency
          </option>
          <option value="Monthly">Monthly</option>
          <option value="Semimonthly">Semimonthly</option>
          <option value="Biweekly">Biweekly</option>
          <option value="Weekly">Weekly</option>
        </select>
        {errors.paymentFrequency && (
          <p className="text-red-500">Payment frequency is required.</p>
        )}

        <Controller
          name="salary"
          control={control}
          rules={{ required: true }}
          render={({ field: { ref, onChange } }) => (
            <NumericFormat
              thousandSeparator=","
              decimalSeparator="."
              prefix="$ "
              decimalScale={2}
              getInputRef={ref}
              onValueChange={(values) => {
                onChange(values.floatValue);
              }}
            />
          )}
        />
        {errors.salary && <p className="text-red-500">Salary is required.</p>}

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
    </>
  );
}
