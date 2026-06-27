import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

let API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (API_URL && !API_URL.endsWith("/api")) {
  API_URL = `${API_URL}/api`;
}
console.log("Using API_URL inside AuthContext:", API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const setAuthSession = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        return { success: true, data: res.data.data };
      }
      return { success: false, error: res.data.message || "Failed to login" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Server error during login"
      };
    }
  };

  const register = async (name, email, password, workspaceName) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        workspaceName
      });
      if (res.data.success) {
        return { success: true, data: res.data.data };
      }
      return { success: false, error: res.data.message || "Failed to register" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Server error during registration"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setAuthSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
