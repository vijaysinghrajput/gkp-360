import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state for auth

  useEffect(() => {
    // Simulate user loading from localStorage or API
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Example: API call to login
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.status) {
      setUser(data.data);
      localStorage.setItem("authUser", JSON.stringify(data.data));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
