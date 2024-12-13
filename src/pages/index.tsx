import withProtection from "@/components/common/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (user) {
    switch (user.role) {
      case "ADMIN": {
        router.push("/admin");
        break;
      }
      case "HR": {
        router.push("/hr/submissions");
        break;
      }
      case "VENDOR": {
        router.push("/vendor/submissions/assigned");
        break;
      }
    }
  }

  if (!user && isLoading) {
    router.push("/login");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner />
    </Box>
  );
}

export default withProtection(Home);
