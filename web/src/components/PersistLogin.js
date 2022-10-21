import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import Loading from "./Loading";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const verifyRefreshToken = async () => {
      await refresh();
      mounted && setIsLoading(false);
    };

    !auth?.access_token && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (mounted = false);
  }, [auth?.access_token, persist, refresh]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <div className='d-flex h-100 justify-content-center align-items-center'>
          <Loading size={"lg"} />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
