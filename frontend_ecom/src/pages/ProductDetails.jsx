import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteProduct, getProductById } from "../services/product.service.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProductById(id);
        const productData = response.data?.data;

        if (!productData) {
          throw new Error("Product not found.");
        }

        if (isMounted) {
          setProduct(productData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "We couldn’t load this product. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );

    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      navigate("/products");
    } catch (deleteError) {
      const errorMessage =
        deleteError.response?.data?.message ||
        "Failed to delete product. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
            Catalog / Product details
          </p>
          <Link
            to="/products"
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Back to Products
          </Link>
        </div>

        {isLoading ? (
          <section
            aria-live="polite"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center"
            role="status"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-orange-500" />
            <p className="text-sm text-slate-300">Loading product details...</p>
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-red-500/30 bg-slate-900 p-8 text-center shadow-2xl shadow-black/20">
            <h1 className="text-xl font-semibold text-white">
              Product unavailable
            </h1>
            <p className="mt-3 text-sm text-red-300" role="alert">
              {error}
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Back to Products
            </Link>
          </section>
        ) : (
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
            <div className="grid md:grid-cols-2">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-64 w-full bg-slate-800 object-cover sm:h-80 md:h-full md:min-h-[26rem]"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-slate-800 text-sm text-slate-500 sm:h-80 md:min-h-[26rem]">
                  No product image
                </div>
              )}

              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-medium text-orange-400">Product</p>
                <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-5 text-2xl font-semibold text-orange-400">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-8 border-t border-slate-800 pt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Description
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                    {product.description || "No description provided."}
                  </p>
                </div>

                <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Stock
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-200">
                      {product.stock}
                    </dd>
                  </div>
                  {product._id && (
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Product ID
                      </dt>
                      <dd className="mt-1 truncate text-sm text-slate-300">
                        {product._id}
                      </dd>
                    </div>
                  )}
                  {product.createdAt && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Added
                      </dt>
                      <dd className="mt-1 text-sm text-slate-300">
                        {formatDate(product.createdAt)}
                      </dd>
                    </div>
                  )}
                  {product.updatedAt && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Last updated
                      </dt>
                      <dd className="mt-1 text-sm text-slate-300">
                        {formatDate(product.updatedAt)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <Link
                    to={`/products/${product._id}/edit`}
                    className="inline-flex justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Edit Product
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex justify-center rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Deleting..." : "Delete Product"}
                  </button>
                  <Link
                    to="/products"
                    className="inline-flex justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    Back to Products
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
