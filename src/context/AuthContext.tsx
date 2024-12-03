import { verifyAuthToken } from "@/controllers/auth.controller";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface AuthContextType {
  verifyToken: (token: string) => Promise<{
    id: string;
    email: string;
    role: "ADMIN" | "HR" | "VENDOR";
  }>;
  user: any; // Replace with your user type/interface
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to prevent flickering

  const router = useRouter();

  const verifyToken = async (token: string) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      (async () => {
        try {
          await verifyToken(storedToken); // Re-verify token on page load
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Token expired. Please login again.", {
            position: "bottom-center",
          });
          router.push("/login"); // Redirect to login on failure
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
      router.push("/login"); // Redirect if no token or user
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        verifyToken,
        user,
        token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
