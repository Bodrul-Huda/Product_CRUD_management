import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { setCredentials } from "../store/slices/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    setApiError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      dispatch(
        setCredentials({
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        }),
      );

      // Trigger success toast
      toast.success("Signed in successfully!");

      navigate("/products");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Unable to sign in. Check your details and try again.";

      setApiError(errorMessage);

      // Trigger error toast
      toast.error(errorMessage);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Product Manager
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to manage your products and keep your catalog moving.
          </p>
        </div>

        <div aria-live="polite" className="mb-5 min-h-0">
          {apiError && (
            <p
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              {apiError}
            </p>
          )}
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              {...register("password", {
                required: "Password is required.",
              })}
            />
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 transition hover:text-orange-400"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
