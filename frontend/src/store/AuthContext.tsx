import axiosInstance from "../utils/axiosInstance";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  firstName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setAuth({ token, user: parsedUser });
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/login", { email, password });

      const userData: User = {
        id: data.userId || data._id,
        firstName: data.firstName || "",
        email: data.email || "",
      };

      setAuth({ user: userData, token: data.token });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // toast.success("🎉 Login successful!");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Invalid email or password.");
      throw new Error(error.response?.data?.message || "Invalid email or password.");
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      const userData: User = {
        id: data.userId || data._id,
        firstName: data.firstName || "",
        email: data.email || "",
      };

      setAuth({ user: userData, token: data.token });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // toast.success("🎉 Registration successful! Welcome aboard.");
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed.");
      throw new Error(error.response?.data?.message || "Registration failed.");
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("👋 You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ ...auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
