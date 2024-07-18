"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import Dropzone from "@/gov/components/Dropzone";

const InfoForm = ({
  onSubmitInfo
}: {
  onSubmitInfo: (_data: FieldValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => onSubmitInfo(data))}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center">
          <h2 className="text-lg">Upload your driver's license or ID card</h2>
          <p className="upload-tooltip-anchor">❗</p>
          <Tooltip anchorSelect=".upload-tooltip-anchor">
            For demo purposes, no need to upload
          </Tooltip>
        </div>
        <Dropzone />

        <p className="text-lg">
          Please provide your public identifier (e.g.
          <a href="https://docs.semaphore.pse.dev/V3/guides/identities">
            Semaphore identity commitment
          </a>
          ). We'll issue your ID POD to this public identifier.
          <span className="info-tooltip-anchor">❗</span>
          <Tooltip anchorSelect=".info-tooltip-anchor">
            You can get this from{" "}
            {process.env.NEXT_PUBLIC_GPC_PROVER_CLIENT_URL}, see "Identity,
            Public identifier".
          </Tooltip>
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
          type="number"
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
    </>
  );
};

export default InfoForm;
