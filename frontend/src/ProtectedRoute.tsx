import { FC, useLayoutEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "./axios_instance";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  authLevel: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ authLevel }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const authCheck = async () => {
      setIsLoading(true);
      const JWT = localStorage.getItem("access_token");

      if (!JWT) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsStaff(false);
        window.location.href = "/login"
        return;
      } else {
        setIsAuthenticated(true);
      }

      try {
        const token = jwtDecode(JWT);
        const user_id = token["sub"];
        const response = await axiosInstance.get(`/users/${user_id}`);
        if (response.data) {
          setIsAdmin(response.data.is_admin);
          setIsStaff(response.data.is_staff);
          setIsActive(response.data.active);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    authCheck();

    return () => {
      // cancel/clean up any pending/in-flight async auth checks
      const controller = new AbortController()
      controller.abort()
    };
  }, [location.pathname]);

  if (isLoading) {
    return null;
  }

  if (isActive) {
    if (isAuthenticated && isAdmin) {
      return <Outlet />;
    } else if (isAuthenticated && authLevel === "staff" && isStaff && !isAdmin) {
      return <Outlet />;
    } else if (isAuthenticated && authLevel === "user" && !isStaff && !isAdmin) {
      return <Outlet />;
    } else {
      console.log('Not authorized')
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
