import React, { createContext, useState } from "react";
import { verifyEmail, verifyPhone } from "../utils/verify";
import api from "../utils/api";

const AuthContext = createContext(null);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const updatePersist = (newPersist) => {
    setPersist(newPersist);
    localStorage.setItem("persist", newPersist);
  };

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
      updatePersist(rememberMe);
      redirect_url = `/${user.username}`;
    } else {
      updatePersist(false);
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
      updatePersist(rememberMe);
      redirect_url = `/${user.username}`;
    } else {
      updatePersist(false);
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
    updatePersist(false);
    await api.delete("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, persist, setPersist, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
