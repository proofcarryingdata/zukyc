"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import useLoginCreds from "@/shared/hooks/useLoginCreds";

const Login = ({ onLogin }: { onLogin: (_data: FieldValues) => void }) => {
  const loginCreds = useLoginCreds();
  console.log(loginCreds);

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
          For demo purposes, try email: {loginCreds.email}, password:{" "}
          {loginCreds.password}
        </Tooltip>
      </div>

      <form
        onSubmit={handleSubmit((data) => onLogin(data))}
        className="flex flex-col gap-2"
      >
        <div className="form-group flex gap-12 items-center">
          <label htmlFor="email">Email:</label>
          <input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format."
              }
            })}
            type="email"
            value={loginCreds.email}
            className="form-input px-4 py-3 rounded grow"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message as string}</p>
          )}
        </div>

        <div className="form-group flex gap-3.5 items-center">
          <label htmlFor="password">Password:</label>
          <input
            {...register("password", { required: "Password is required." })}
            type="password"
            value={loginCreds.password}
            className="form-input px-4 py-3 rounded grow"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message as string}</p>
          )}
        </div>

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
