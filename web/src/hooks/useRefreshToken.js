import api from "../utils/api";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, setPersist } = useAuth();

  const refresh = async () => {
    const { data, success } = await api.get("/refresh");
    if (!success) {
      setPersist(false);
      return;
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
