import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function AuthRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    auth.refresh();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div>
        <h3>Login to view content</h3>
      </div>
    );
    // return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return children;
}
