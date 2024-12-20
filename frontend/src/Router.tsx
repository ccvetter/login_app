import { createBrowserRouter } from "react-router-dom";
import axiosInstance from "./axios_instance";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
// import Items from "./components/items/Items";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const getUserId = () => {
    const access_token = getAccessToken();
    if (access_token) {
        const token = jwtDecode(access_token);
        console.log(token)
        return token['sub'];
    }
}

const isAdmin = () => {
    const user_id = getUserId();
    axiosInstance.get(`/${user_id}`).then((response) => {
        console.log(response)
        return response.data["is_admin"]
    })
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
