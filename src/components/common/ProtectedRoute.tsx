import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";

export type Permissions = "ADMIN" | "HR" | "VENDOR";

export interface ProtectedRouteOptions {
  permissions?: Permissions[];
  redirectTo?: string;
}

export default function withProtection(
  WrappedComponent,
  options: ProtectedRouteOptions = { permissions: [], redirectTo: "/login" }
) {
  return function ProtectedRoute(props) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
      // Set client-side ready state after hydration
      setIsClientReady(true);
    }, []);

    useEffect(() => {
      if (!router.isReady || isLoading || !isClientReady) return;

      if (!user) {
        router.push(options.redirectTo);
      }
    }, [user, isLoading, router.isReady, isClientReady]);

    // Don't render anything until client-side hydration is complete
    if (!isClientReady) {
      return null;
    }

    // Show loading state only when explicitly loading auth state
    if (isLoading) {
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

    // Don't render protected content if user is not authenticated
    if (!user) {
      return null;
    }

    // Optional: Check permissions here if needed
    if (options.permissions?.length > 0) {
      const hasRequiredPermissions = options.permissions.includes(user.role);

      if (!hasRequiredPermissions) {
        router.back();
        return null; // Or redirect to unauthorized page
      }
    }

    return <WrappedComponent {...props} />;
  };
}
