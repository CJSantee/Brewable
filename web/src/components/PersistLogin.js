import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        mounted && setIsLoading(false);
      }
    };

    !auth?.access_token && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (mounted = false);
  }, [auth?.access_token, persist, refresh]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
}
