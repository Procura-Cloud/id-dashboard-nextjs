import { verifyAuthToken } from "@/controllers/auth.controller";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface AuthContextType {
  user: any; // Replace with your user type/interface
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false); // Loading state to prevent flickering

  const router = useRouter();

  const login = async (token: string) => {
    setisLoading(true);
    try {
      const response = await verifyAuthToken(token);

      if (response.status === 200) {
        const userData = response.data;
        console.log("User data", userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setToken(token);

        return userData;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);

      return null;
    } finally {
      setisLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      (async () => {
        try {
          await login(storedToken); // Re-verify token on page load
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Token expired. Please login again.", {
            position: "bottom-center",
          });
        } finally {
          setisLoading(false);
        }
      })();
    } else {
      setisLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
