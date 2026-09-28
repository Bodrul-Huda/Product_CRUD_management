import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
