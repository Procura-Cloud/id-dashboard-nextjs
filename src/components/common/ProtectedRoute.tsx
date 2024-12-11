import { useAuth } from "@/context/AuthContext";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect } from "react";

export interface ProtectedRouteProps {
  redirectTo?: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  redirectTo = "/login",
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!router.isReady) return;

    if (!user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Show a loading spinner or blank screen while verifying token
    return (
      <Box
        style={{
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

  return <>{children}</>;
}
