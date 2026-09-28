import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/product.service.js";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

const fieldErrorClassName = "mt-2 text-sm text-red-400";

export default function AddProduct() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (formValues) => {
    setApiError("");

    const productData = {
      name: formValues.name.trim(),
      price: formValues.price,
      stock: formValues.stock,
    };
    const description = formValues.description.trim();
    const imageUrl = formValues.imageUrl.trim();

    if (description) {
      productData.description = description;
    }

    if (imageUrl) {
      productData.imageUrl = imageUrl;
    }

    try {
      await createProduct(productData);

      // Trigger success toast
      toast.success("Product created successfully!");

      navigate("/products");
    } catch (error) {
      const validationErrors = error.response?.data?.errors;

      if (Array.isArray(validationErrors)) {
        validationErrors.forEach(({ field, message }) => {
          setError(field, { type: "server", message });
        });
      }

      const errorMessage = validationErrors?.length
        ? "Please review the highlighted fields and try again."
        : error.response?.data?.message ||
          "We couldn’t create this product. Please try again.";

      setApiError(errorMessage);

      // Trigger error toast
      toast.error(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Add product
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Add the details for a new item in your catalog.
          </p>
        </header>

        <form
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {apiError && (
            <p
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {apiError}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Product name <span className="text-orange-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="off"
              placeholder="e.g. Everyday Backpack"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClassName}
              {...register("name", {
                required: "Name is required.",
                validate: (value) =>
                  value.trim().length > 0 || "Name is required.",
              })}
            />
            {errors.name && (
              <p id="name-error" className={fieldErrorClassName}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Description <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the product"
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className={`${inputClassName} resize-y`}
              {...register("description")}
            />
            {errors.description && (
              <p id="description-error" className={fieldErrorClassName}>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Price <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-invalid={errors.price ? "true" : "false"}
                  aria-describedby={errors.price ? "price-error" : undefined}
                  className={`${inputClassName} pl-8`}
                  {...register("price", {
                    required: "Price is required.",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Price must be at least 0.",
                    },
                  })}
                />
              </div>
              {errors.price && (
                <p id="price-error" className={fieldErrorClassName}>
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Stock <span className="text-orange-400">*</span>
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="0"
                aria-invalid={errors.stock ? "true" : "false"}
                aria-describedby={errors.stock ? "stock-error" : undefined}
                className={inputClassName}
                {...register("stock", {
                  required: "Stock is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Stock must be 0 or greater.",
                  },
                  validate: (value) =>
                    Number.isInteger(value) || "Stock must be a whole number.",
                })}
              />
              {errors.stock && (
                <p id="stock-error" className={fieldErrorClassName}>
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Image URL <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="imageUrl"
              type="url"
              inputMode="url"
              placeholder="https://example.com/product-image.jpg"
              aria-invalid={errors.imageUrl ? "true" : "false"}
              aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
              className={inputClassName}
              {...register("imageUrl", {
                validate: (value) => {
                  if (!value.trim()) {
                    return true;
                  }

                  try {
                    const url = new URL(value);
                    return (
                      ["http:", "https:", "ftp:"].includes(url.protocol) ||
                      "Enter a valid URL."
                    );
                  } catch {
                    return "Enter a valid URL including https://.";
                  }
                },
              })}
            />
            {errors.imageUrl && (
              <p id="imageUrl-error" className={fieldErrorClassName}>
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/products")}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating product..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
