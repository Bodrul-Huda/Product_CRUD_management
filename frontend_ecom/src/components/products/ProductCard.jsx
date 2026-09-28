import { Link, useNavigate } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function ProductCard({ product, onDelete, isDeleting }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevents navigating to product details
    onDelete(product);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevents navigating to product details
  };

  return (
    <article
      onClick={handleCardClick}
      className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 transition hover:border-orange-500/50"
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-44 w-full bg-slate-800 object-cover transition group-hover:opacity-90"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 break-words text-lg font-semibold text-white transition group-hover:text-orange-400">
            {product.name}
          </h2>
          <p className="shrink-0 text-sm font-semibold text-orange-400">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-400">
          {product.description || "No description provided."}
        </p>
        <p className="mt-3 text-xs font-medium text-slate-300">
          Stock: <span className="text-slate-400">{product.stock}</span>
        </p>
        <div className="mt-auto flex gap-3 pt-5">
          <Link
            to={`/products/${product._id}/edit`}
            onClick={handleEditClick}
            className="flex-1 rounded-lg border border-slate-700 px-3 py-2.5 text-center text-sm font-medium text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-red-500/30 px-3 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
