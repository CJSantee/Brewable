import React, { createContext, useEffect, useState } from "react";
import { verifyEmail, verifyPhone } from "../utils/verify";
import api from "../utils/api";

const AuthContext = createContext(null);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // Update local storage with persist
  useEffect(() => {
    const curr = JSON.parse(localStorage.getItem("persist"));
    if (curr !== persist) {
      localStorage.setItem("persist", persist);
    }
  }, [persist]);

  const register = async ({
    username,
    name,
    email,
    phone,
    password,
    rememberMe,
  }) => {
    const body = {
      user: {
        username,
        name,
        email: verifyEmail(email),
        phone: verifyPhone(phone),
        password,
      },
    };

    let redirect_url;
    let alerts = [];
    let errors = [];

    const { data, error, success } = await api.post("/users", body);

    if (success) {
      const { access_token, user } = data;
      setAuth({ access_token, user });
      setPersist(rememberMe);
      redirect_url = `/${user.username}`;
    } else {
      setPersist(false);
    }

    if (error) {
      Object.keys(error).forEach((err) => {
        let message = `${err} is already in use.`;
        errors.push({
          [err]: message.charAt(0).toUpperCase() + message.slice(1),
        });
      });
    }

    return { redirect_url, alerts, errors };
  };

  const login = async ({ userIdentifier, password, rememberMe }) => {
    const email = verifyEmail(userIdentifier);
    const phone = verifyPhone(userIdentifier);
    const body = {
      email,
      phone,
      password,
    };

    let redirect_url;
    let alerts = [];
    let errors = [];

    const { data, error, success } = await api.post("/auth", body);

    if (success) {
      const { access_token, user } = data;
      setAuth({ access_token, user });
      setPersist(rememberMe);
      redirect_url = `/${user.username}`;
    } else {
      setPersist(false);
    }

    if (error) {
      errors.push(error);
      alerts.push({
        type: "danger",
        message: error.message,
        timeout: 3000,
      });
    }

    return { redirect_url, alerts, errors };
  };

  const logout = async () => {
    setAuth({});
    setPersist(false);
    await api.delete("/auth");
  };

  const switchLogin = async ({ user_id }) => {
    await logout();

    let redirect_url;

    const { data, success } = await api.post("/backdoor", { user_id });

    if (success) {
      const { access_token, user } = data;
      setAuth({ access_token, user });
      setPersist(true);
      redirect_url = `/${user.username}`;
    }

    return { redirect_url };
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        register,
        login,
        logout,
        switchLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
