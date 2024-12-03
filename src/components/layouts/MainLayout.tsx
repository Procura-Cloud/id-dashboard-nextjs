import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiHome, FiUser, FiSettings, FiMenu } from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";
import { TfiLocationPin } from "react-icons/tfi";
import { useAuth } from "@/context/AuthContext";
import { CiShop } from "react-icons/ci";
import { useRouter } from "next/router";

export default function MainLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loading } = useAuth();

  if (loading) {
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

  const adminMenuItems = [
    { name: "Admins", icon: FiHome, path: "/admin" },
    { name: "HR", icon: FiUser, path: "/hr" },
    { name: "Submissions", icon: FiSettings, path: "/submission" },
    { name: "Locations", icon: TfiLocationPin, path: "/location" },
    { name: "Vendors", icon: CiShop, path: "/vendor" },
  ];

  const hrMenuItems = [
    { name: "HR", icon: FiUser, path: "/hr" },
    { name: "Submissions", icon: FiSettings, path: "/submission" },
    { name: "Locations", icon: TfiLocationPin, path: "/location" },
  ];

  const vendorMenuItems = [
    { name: "Submissions", icon: FiSettings, path: "/submission" },
  ];

  const menuItems =
    user.role === "ADMIN"
      ? adminMenuItems
      : user.role === "HR"
      ? hrMenuItems
      : vendorMenuItems;

  return (
    <Flex h="100vh" bg="gray.100">
      {/* Mobile Toggle Button */}
      <Box
        display={{ base: isOpen ? "none" : "block", md: "none" }}
        position="fixed"
        top={4}
        left={4}
        zIndex="overlay"
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="md"
        cursor="pointer"
        onClick={onOpen}
      >
        <Icon as={FiMenu} boxSize={6} />
      </Box>

      {/* Sidebar */}
      <Box
        as="nav"
        w={{ base: isOpen ? "full" : 0, md: "250px" }}
        h="100vh"
        bg="white"
        boxShadow="xl"
        zIndex="overlay"
        overflowX="hidden"
        position="fixed"
        transition="width 0.2s ease"
      >
        <Box p={4} display="flex" justifyContent="center" alignItems="center">
          <CloseIcon
            display={{ base: "block", md: "none" }}
            boxSize={4}
            cursor="pointer"
            onClick={onClose}
          />
          <Image src={"/assets/niq_logo.png"} alt="niq logo" width={100} />
        </Box>
        <VStack spacing={4} align="stretch" mt={6} px={4}>
          {menuItems.map((item) => (
            <Link
              href={item.path}
              key={item.name}
              display="flex"
              alignItems="center"
              p={3}
              borderRadius="md"
              _hover={{ bg: "teal.100", textDecoration: "none" }}
            >
              <Icon as={item.icon} boxSize={5} mr={3} color="blue" />
              <Text fontWeight="medium">{item.name}</Text>
            </Link>
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml={{ md: "250px" }} w="full" p={6} bg="gray.50">
        <Text fontSize="lg">{children}</Text>
      </Box>
    </Flex>
  );
}
