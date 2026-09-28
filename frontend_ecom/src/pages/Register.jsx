import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service.js";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    try {
      const response = await registerUser(formData);

      // Trigger success toast
      toast.success(
        response.data?.message ||
          "Account created successfully! Please log in.",
      );

      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map((e) => e.message).join(" ")
        : error.response?.data?.message ||
          "We couldn’t create your account. Please try again.";

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
            Create an account
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Start managing your products and organizing your catalog today.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Full Name */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              aria-invalid={errors.name ? "true" : "false"}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              {...register("name", {
                required: "Full name is required.",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters.",
                },
              })}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
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
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
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
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={errors.password ? "true" : "false"}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 transition hover:text-orange-400"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
