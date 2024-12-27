import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user state (e.g., from localStorage or an API)
    const token = localStorage.getItem("authToken");
    if (token) {
      setUser({ token }); // Simulate user object
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
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      setUser({ token: data.token });
      router.push("/dashboard");
    } else {
      alert("Invalid login credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
