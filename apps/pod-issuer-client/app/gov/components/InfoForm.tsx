"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { DEMO_ID_NUMBER } from "@/util/constants";
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
          <h2 className="text-lg">
            Enter your driver's license or ID card number
          </h2>
          <p className="personal-details-tooltip-anchor">❗</p>
          <Tooltip anchorSelect=".personal-details-tooltip-anchor">
            For demo purposes, try ID number: {DEMO_ID_NUMBER}
          </Tooltip>
        </div>

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
          value="Issue ID POD"
        />
      </form>
    </>
  );
};

export default InfoForm;
