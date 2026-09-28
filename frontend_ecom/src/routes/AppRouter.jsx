import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddProduct from "../pages/AddProduct.jsx";
import EditProduct from "../pages/EditProduct.jsx";
import Login from "../pages/Login.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import Products from "../pages/Products.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import App from "../App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/new",
        element: <AddProduct />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "products/:id/edit",
        element: <EditProduct />,
      },
    ],
  },
]);

// The router is exported for the application entry point and route tests.
// eslint-disable-next-line react-refresh/only-export-components
export { router };

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
