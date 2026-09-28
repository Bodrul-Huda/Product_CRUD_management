import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteProduct, getProducts } from "../services/product.service.js";
import ProductCard from "../components/products/ProductCard.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getProducts();
        if (isMounted) {
          setProducts(
            Array.isArray(response.data?.data) ? response.data.data : [],
          );
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message ||
              "We couldn’t load your products. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete “${product.name}”?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(product._id);

    try {
      await deleteProduct(product._id);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id),
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Couldn’t delete “${product.name}”. Please try again.`;

      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Catalog
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Products
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage the products in your store.
            </p>
          </div>
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Add Product
          </Link>
        </header>

        {isLoading ? (
          <div
            aria-label="Loading products"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="status"
          >
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                <div className="h-44 animate-pulse bg-slate-800" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            ))}
            <span className="sr-only">Loading products...</span>
          </div>
        ) : loadError ? (
          <section className="rounded-xl border border-red-500/30 bg-slate-900 p-8 text-center">
            <p className="text-sm text-red-300" role="alert">
              {loadError}
            </p>
          </section>
        ) : products.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-700 bg-slate-900/70 px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-white">
              No products yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Add your first product to start building your catalog.
            </p>
            <Link
              to="/products/new"
              className="mt-6 inline-flex rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Add your first product
            </Link>
          </section>
        ) : (
          <section
            aria-label="Product list"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
                isDeleting={deletingId === product._id}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
