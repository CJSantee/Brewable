import React, { useState } from "react";
import { authProvider } from "../utils/auth";

let AuthContext = React.createContext(null);

// AuthProvider Component
export default function AuthProvider({ children }) {
  let [userId, setUserId] = useState(null);

  let register = (formValues, callback, fail) => {
    return authProvider.register(
      formValues,
      ({ user_id }) => {
        setUserId(user_id);
        callback();
      },
      (error) => {
        fail(error);
      }
    );
  };

  let login = (formValues, callback) => {
    return authProvider.login(formValues, ({ user_id }) => {
      setUserId(user_id);
      callback();
    });
  };

  let signout = (callback) => {
    return authProvider.signout(() => {
      setUserId(null);
      callback();
    });
  };

  let refresh = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      setUserId(user.user_id);
    }
  };

  let value = {
    userId,
    refresh,
    register,
    login,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for Authentication Context
function useAuth() {
  return React.useContext(AuthContext);
}

export { useAuth };
