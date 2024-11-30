import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "@/components/layouts/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const getLayout = () => {
    if (router.pathname === "/verify") {
      return (
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      );
    }

    if (router.pathname.startsWith("/candidate")) {
      return <Component {...pageProps} />;
    }

    if (router.pathname === "/login") {
      return (
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      );
    }

    return (
      <AuthProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthProvider>
    );
  };

  return (
    <ChakraProvider>
      <NuqsAdapter>
        {getLayout()}
        <ToastContainer />
      </NuqsAdapter>
    </ChakraProvider>
  );
}
