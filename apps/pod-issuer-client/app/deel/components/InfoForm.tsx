"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import useStore from "@/shared/hooks/useStore";

const InfoForm = ({
  onSubmitInfo
}: {
  onSubmitInfo: (_data: FieldValues) => void;
}) => {
  const semaphoreCommitment = useStore((state) => state.semaphoreCommitment);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmitInfo(data))}
      className="flex flex-col gap-4"
    >
      {!semaphoreCommitment && (
        <>
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
            type="number"
            className="form-input px-4 py-3 rounded"
            placeholder="Public identifier (Semaphore identity commiment)"
          />
          {errors.semaphoreCommitment && (
            <p className="text-red-500">
              {errors.semaphoreCommitment.message as string}
            </p>
          )}
        </>
      )}

      <input
        type="submit"
        className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
        value="Issue New Paystub POD"
      />
    </form>
  );
};

export default InfoForm;
