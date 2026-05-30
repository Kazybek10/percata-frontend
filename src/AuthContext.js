import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    if (!isTokenValid(t)) {
      localStorage.removeItem("token");
      return null;
    }
    return t;
  });

  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!isTokenValid(t)) return null;
    try { return JSON.parse(atob(t.split(".")[1])); } catch { return null; }
  });

  function login(jwt) {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    try { setUser(JSON.parse(atob(jwt.split(".")[1]))); } catch { setUser(null); }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
