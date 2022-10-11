import { api } from "../utils/api";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const { data } = await api.get("/refresh");
    if (!data) {
      return null;
    }
    setAuth((prev) => {
      const { access_token, user } = data;
      return {
        ...prev,
        access_token,
        user,
      };
    });
    return data.access_token;
  };

  return refresh;
};

export default useRefreshToken;
