import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "@/components/layouts/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <NuqsAdapter>
            <Component {...pageProps} />
            <ToastContainer />
          </NuqsAdapter>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
