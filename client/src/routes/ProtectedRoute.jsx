import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuthContext();

  if (!user) {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
