import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthRoute({ roles }) {
  const { auth } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!auth.access_token) {
    return <Navigate to='/' state={{ from: location }} />;
  }
  // Does not have the correct role
  if (roles?.length && !roles.every((role) => auth.user.roles.includes(role))) {
    return <Navigate to='/' state={{ from: location }} />;
  }

  return <Outlet />;
}
