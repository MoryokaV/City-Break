import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import App from "./App";
import ErrorPage from "./pages/404";
import Login from "./pages/Login";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SightPage from "./pages/Sight";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "sight",
            element: <SightPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
