import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  user: { id: string; firstName: string; email: string } | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      setAuth({
        user: { id: data.userId, firstName: data.firstName, email: data.email },
        token: data.token,
      });

      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Registration failed.", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
        const { data } = await axios.post("/api/auth/login", {
            email,
            password,
          });
          setAuth({
            user: { id: data.userId, firstName: data.firstName, email: data.email },
            token : data.token
          });
          localStorage.setItem("token", data.token);
    } catch (error) {
        console.error("Login failed..", error);       
    }
  };
  const logout = () =>{
        setAuth({user:null, token:null});
        localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ ...auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};