import { useAuth } from "@/context/AuthContext";
import { loginAdmin } from "@/controllers/admin.controller";
import { loginHR } from "@/controllers/hr.controller";
import { loginVendor } from "@/controllers/vendor.controller";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const handleSubmit = async (userType) => {
    setIsLoading(true);
    try {
      switch (userType) {
        case "Admin": {
          const response = await loginAdmin(email);
          console.log(response);

          toast.success("Login successful. Please check your email.", {
            position: "bottom-center",
          });
          break;
        }
        case "HR": {
          const response = await loginHR(email);
          console.log(response);

          toast.success("Login successful. Please check your email.", {
            position: "bottom-center",
          });
          break;
        }
        case "Vendor": {
          const response = await loginVendor(email);

          console.log(response);

          toast.success("Login successful. Please check your email.", {
            position: "bottom-center",
          });
          break;
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || authLoading) return;

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
          router.push("/vendor/submissions");
          break;
        }
      }
    }
  }, [user]);

  return (
    <Center minH="100vh" bgGradient="linear(to-br, teal.500, blue.500)">
      <Box w="full" maxW="lg" p={6} bg="white" borderRadius="lg" boxShadow="lg">
        <Heading textAlign="center" size="lg" color="teal.600" mb={6}>
          Login Portal
        </Heading>
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList justifyContent="center" mb={6}>
            <Tab>Admin</Tab>
            <Tab>HR</Tab>
            <Tab>Vendor</Tab>
          </TabList>
          <TabPanels>
            {["Admin", "HR", "Vendor"].map((userType) => (
              <TabPanel key={userType}>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSubmit(userType);
                  }}
                >
                  <VStack spacing={4}>
                    <FormControl id={`email-${userType}`} isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        placeholder={`Enter your email (${userType})`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        focusBorderColor="teal.500"
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      size="lg"
                      width="full"
                      _hover={{ bg: "teal.600" }}
                      isLoading={isLoading}
                    >
                      Send Magic Link
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
        <Text textAlign="center" mt={6} color="gray.600">
          Choose your login type above to continue.
        </Text>
      </Box>
    </Center>
  );
}
