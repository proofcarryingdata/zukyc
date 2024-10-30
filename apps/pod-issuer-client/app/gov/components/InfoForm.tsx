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
        Please provide your public key (e.g. encoded{" "}
        <a href="https://docs.semaphore.pse.dev/guides/identities">
          Semaphore public key
        </a>
        ). We'll issue your ID POD to this public key.
        <span className="info-tooltip-anchor">❗</span>
        <Tooltip anchorSelect=".info-tooltip-anchor">
          You can get this from {process.env.NEXT_PUBLIC_GPC_PROVER_CLIENT_URL},
          see "Identity, Public key".
        </Tooltip>
      </p>
      <input
        {...register("semaphorePublicKey", {
          required: true
        })}
        type="text"
        className="form-input px-4 py-3 rounded"
        placeholder="Public key (encoded Semaphore public key)"
      />
      {errors.semaphorePublicKey && (
        <p className="text-red-500">
          {(errors.semaphorePublicKey.message as string) ||
            "Public identifier is required."}
        </p>
      )}

      <input
        type="submit"
        className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
        value="Issue ID POD"
      />
    </form>
  );
};

export default InfoForm;
