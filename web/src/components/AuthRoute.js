import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthRoute() {
  const { auth } = useAuth();
  const location = useLocation();

  // TODO: Add acls
  if (auth?.access_token) {
    return <Outlet />;
  } else {
    return <Navigate to='/' state={{ from: location }} />;
  }
}
