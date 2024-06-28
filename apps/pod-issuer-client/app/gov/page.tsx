"use client";

import { useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";

export default function Gov() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const issuePOD = useCallback((data: FieldValues) => {
    console.log(data);
  }, []);

  return (
    <main className="p-6 m-0 flex flex-col gap-4 h-screen max-h-screen">
      <h1 className="text-xl font-bold">ZooGov</h1>
      <h2 className="text-lg">Govenment ID POD issuer</h2>
      <p>
        Imagine this is a govenment website, you can login or upload your ID,
        and then the govenment will issue you an ID POD.
      </p>
      <p>Here for demo, we'll just ask you to input your information below.</p>

      <form
        onSubmit={handleSubmit((data) => issuePOD(data))}
        className="flex flex-col gap-2"
      >
        <input
          {...(register("firstName"), { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="First name"
        />
        {errors.firstName && <p>First name is required.</p>}

        <input
          {...register("lastName", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Last name"
        />
        {errors.lastName && <p>Last name is required.</p>}

        <input
          {...register("age", { required: true, pattern: /\d+/ })}
          type="number"
          className="form-input px-4 py-3 rounded"
          placeholder="Age"
        />
        {errors.age && <p>Age is required. Please enter number for age.</p>}

        <input
          {...register("identityCommitment", { required: true })}
          type="text"
          className="form-input px-4 py-3 rounded"
          placeholder="Public identifier (Semaphore identity commiment)"
        />
        {errors.identityCommitment && (
          <p>Please enter your public identifier</p>
        )}
        <input
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
          value="Issue ID POD"
        />
      </form>

      <div className="flex flex-col">
        <span>ID POD</span>
        <textarea
          className="border-none"
          readOnly
          rows={10}
          value={"ID POD Here"}
        />
      </div>
    </main>
  );
}
