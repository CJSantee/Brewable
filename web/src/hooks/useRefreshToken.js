import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get(API_URL + "/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      const { access_token, user } = response.data;
      return {
        ...prev,
        access_token,
        user,
      };
    });
    return response.data.access_token;
  };

  return refresh;
};

export default useRefreshToken;
