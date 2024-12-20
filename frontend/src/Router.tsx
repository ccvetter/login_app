import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
// import Items from "./components/items/Items";
import ProtectedRoute from "./ProtectedRoute";

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const isAdmin = () => {
  return localStorage.getItem("is_staff") === "true" ? true : false;
};

const isAuthenticated = () => {
  return !!getAccessToken();
};

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
      index: true
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
      children: [
        {
          path: "/",
          element: <><Dashboard /></>,
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
