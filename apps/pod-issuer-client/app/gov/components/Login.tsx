"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/util/constants";

const Login = ({ onLogin }: { onLogin: (_data: FieldValues) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <>
      <div className="flex items-center">
        <h2 className="text-lg">Login</h2>
        <p className="login-tooltip-anchor">❗</p>
        <Tooltip anchorSelect=".login-tooltip-anchor">
          For demo purposes, try email: {DEMO_EMAIL}, password: {DEMO_PASSWORD}
        </Tooltip>
      </div>

      <form
        onSubmit={handleSubmit((data) => onLogin(data))}
        className="flex flex-col gap-2"
      >
        <input
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format"
            }
          })}
          type="email"
          className="form-input px-4 py-3 rounded"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500">Email is required.</p>}

        <input
          {...register("password", { required: true })}
          type="password"
          className="form-input px-4 py-3 rounded"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500">Password is required.</p>
        )}

        <input
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 form-input px-4 py-3 rounded"
          value="Log in"
        />
      </form>
    </>
  );
};

export default Login;
