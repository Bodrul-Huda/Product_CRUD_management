import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import AuthBootstrap from "./components/auth/AuthBootstrap.jsx";
import { router } from "./routes/AppRouter.jsx";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
        },
      }}
    />
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  </Provider>,
);
