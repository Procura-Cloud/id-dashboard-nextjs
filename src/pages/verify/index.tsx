import { useAuth } from "@/context/AuthContext";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyPage() {
  const router = useRouter();
  const { verifyToken } = useAuth();

  const login = async (token) => {
    const userData: {
      id: string;
      email: string;
      role: "ADMIN" | "HR" | "VENDOR";
    } = await verifyToken(token);

    switch (userData.role) {
      case "ADMIN": {
        router.push("/admin");
        break;
      }
      case "HR": {
        router.push("/hr");
        break;
      }
      case "VENDOR": {
        router.push("/vendor");
        break;
      }
    }
  };

  useEffect(() => {
    const token = router.query.token as string;

    if (!router.isReady) return;

    if (!token) {
      toast.error("Invalid token.", {
        position: "bottom-center",
      });

      router.push("/login");
      return;
    }

    login(token);
  }, [router.query]); // Add dependency to ensure it re-runs when `token` is available

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
}
