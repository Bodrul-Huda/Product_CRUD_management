import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service.js";
import { clearCredentials } from "../../store/slices/authSlice.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Always clear local auth state, even if the server request fails.
    } finally {
      dispatch(clearCredentials());
      navigate("/login");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-white transition hover:text-orange-400"
          >
            Product <span className="text-orange-500">Manager</span>
          </Link>
        </div>

        {isAuthenticated && (
          <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:border-0 sm:pt-0">
            <div className="min-w-0 sm:text-right">
              <p className="truncate text-sm font-medium text-slate-100">
                {user?.name || user?.email || "Account"}
              </p>
              {user?.name && user?.email && (
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg border border-orange-600/60 bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
