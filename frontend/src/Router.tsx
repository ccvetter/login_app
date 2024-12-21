import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
// import Items from "./components/items/Items";
import ProtectedRoute from "./ProtectedRoute";

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
      element: <ProtectedRoute authLevel={"user"} />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
    {
      element: <ProtectedRoute authLevel={"admin"} />,
      children: [
        {
          path: "/users",
          element: <Users />,
        },
      ],
    },
    {
        element: <ProtectedRoute authLevel={"staff"} />,
        children: [
            {
                path: "/users",
                element: <Users />,
            }
        ]
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
