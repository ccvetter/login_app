import { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "./axios_instance";

interface ProtectedRouteProps {
  authLevel: string;
}

const ProtectedRoute = ({ authLevel }: ProtectedRouteProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isStaff: false,
    isActive: true,
    isLoading: true,
  });

  const navigateTo = useCallback((route: string) => {
    setTimeout(() => navigate(route, { replace: true }), 0);
  }, [navigate]);

  const handleUnauthenticated = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      isAdmin: false,
      isStaff: false,
      isLoading: false,
    }));
    localStorage.clear();
    navigateTo("/login");
  }, [navigateTo]);

  const handleAuthError = useCallback(
    (error: unknown) => {
      if (!toast.isActive("authError")) {
        toast.error("There was an error", { toastId: "authError" });
      }
      console.error(error);
      localStorage.clear();
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      navigateTo("/");
    },
    [navigateTo]
  );

  useEffect(() => {
    const authCheck = async () => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const JWT = localStorage.getItem("access_token");

      if (!JWT) {
        handleUnauthenticated();
        return;
      }

      try {
        const token: { sub: string } = jwtDecode(JWT);
        const userId = token.sub;
        const response = await axiosInstance.get(`/users/${userId}`);

        if (response.data) {
          setAuthState({
            isAuthenticated: true,
            isAdmin: response.data.is_admin,
            isStaff: response.data.is_staff,
            isActive: response.data.active,
            isLoading: false,
          });
        }
      } catch (error) {
        handleAuthError(error);
      }
    };

    authCheck();
  }, [pathname, handleUnauthenticated, handleAuthError]);

  if (authState.isLoading) {
    return null;
  }

  if (!authState.isActive) {
    if (!toast.isActive("notAuthenticated")) {
      setTimeout(
        () =>
          toast.error("Account is inactive", { toastId: "notAuthenticated" }),
        0
      );
    }
    navigateTo("/login")
    return null;
  }

  if (authState.isAuthenticated) {
    if (authState.isAdmin) {
      return <Outlet />;
    }
    if (authLevel === "staff" && (authState.isStaff || authState.isAdmin)) {
      return <Outlet />;
    }
    if (authLevel === "user") {
      return <Outlet />;
    }
    if (!toast.isActive("notAuthorized")) {
      setTimeout(
        () => toast.error("Not authorized", { toastId: "notAuthorized" }),
        0
      );
    }
    navigateTo("/")
    return null;
  }

  handleUnauthenticated();
  return null;
};

export default ProtectedRoute;
