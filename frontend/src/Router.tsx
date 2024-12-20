import { createBrowserRouter } from "react-router-dom";
import axiosInstance from "./axios_instance";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
// import Items from "./components/items/Items";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const getUser = async () => {
    const access_token = getAccessToken();
    if (access_token) {
      const token = jwtDecode(access_token);
      const user_id = token["sub"];
      axiosInstance.get(`/users/${user_id}`).then((response) => {
        return response.data;
      })
    } 
    return null;
}

const isAdmin = async () => {
    const user = await getUser();
    console.log(user)
    if (user) {
        axiosInstance.get(`/users/${user.id}`).then((response) => {
            return response.data["is_admin"]
        })
    }
    return false
}


// const isAdmin = () => {
//   return localStorage.getItem("is_admin") === "true" ? true : false;
// };

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
          element: <Dashboard />,
        },
      ],
    },
    {
      element: <ProtectedRoute isAuthenticated={isAdmin()} />,
      children: [
        {
          path: "/users",
          element: <Users />,
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
