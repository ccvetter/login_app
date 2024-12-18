import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
// import Items from "./components/items/Items";
import ProtectedRoute from "./ProtectedRoute";

const getAccessToken = () => {
  return sessionStorage.getItem("access_token");
};

const isAdmin = () => {
  return sessionStorage.getItem("is_staff") == "true" ? true : false;
};

const isAuthenticated = () => {
  return !!getAccessToken();
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Dashboard />,
      index: true,
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
      element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
      children: [
        {
          path: "/dashboard",
          element: <>Dashboard</>,
        },
      ],
    },
    {
      element: <ProtectedRoute isAuthenticated={isAdmin()} />,
      children: [
        {
          path: "/items",
          element: <>Items</>,
        },
      ],
    },
    {
      path: "*",
      element: <p>404 Error - Nothing here...</p>,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_startTransition: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
