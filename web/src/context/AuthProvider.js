import React, { createContext, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { verifyEmail, verifyPhone } from "../utils/verify";
import { api } from "../utils/api";

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

  const register = async ({ username, name, email, phone, password }) => {
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
    let errors = {};
    try {
      const res = await api.post("/users", body);
      const { access_token, user } = res.data;
      setAuth({ access_token, user });
      alerts.push({
        type: "success",
        message: "Account created.",
        timeout: 3000,
      });
      redirect_url = `/${user.username}`;
    } catch (err) {
      updatePersist(false);
      alerts.push({
        type: "warning",
        message: "Sign up failed.",
        timeout: 3000,
      });
      const { email, phone } = err.response.data;
      if (email) {
        let message;
        if (email[0] === "has already been taken") {
          message = "Email is already in use.";
        } else {
          message = email.join(", ");
        }
        errors.email = message;
      }
      if (phone) {
        let message;
        if (phone[0] === "has already been taken") {
          message = "Email is already in use.";
        } else {
          message = phone.join(", ");
        }
        errors.phone = message;
      }
    }

    return { redirect_url, alerts, errors };
  };

  const login = async ({ userIdentifier, password }) => {
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

    const { data, error } = await api.post("/auth", body);

    if (data && !error) {
      const { access_token, user } = data;
      setAuth({ access_token, user });
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
