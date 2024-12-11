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
  Collapse,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";
import { TfiLocationPin, TfiShoppingCart } from "react-icons/tfi";
import { useAuth } from "@/context/AuthContext";
import { CiShop } from "react-icons/ci";
import { useState } from "react";
import { FaPerson } from "react-icons/fa6";

export default function MainLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loading } = useAuth();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

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
    {
      name: "Submissions",
      icon: FiSettings,
      path: "/admin/submissions",
      submenu: [
        { name: "All Submissions", path: "/admin/submissions" },
        { name: "Approve Submissions", path: "/admin/submissions/approve" },
        { name: "Assigned Submissions", path: "/admin/submissions/assigned" },
      ],
    },
    { name: "HR", icon: FaPerson, path: "/admin/hr" },
    { name: "Locations", icon: TfiLocationPin, path: "/location" },
    { name: "Vendors", icon: TfiShoppingCart, path: "/vendor" },
  ];

  const hrMenuItems = [
    {
      name: "Submissions",
      icon: FiSettings,
      path: "/hr/submissions",
      submenu: [],
    },
  ];

  const vendorMenuItems = [
    { name: "Submissions", icon: FiSettings, path: "/vendor/submissions" },
  ];

  const toggleSubmenu = () => setSubmissionsOpen(!submissionsOpen);

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
          {/* Admin Menu */}
          {user.role === "ADMIN" && (
            <>
              {adminMenuItems.map((item) => (
                <Box key={item.name}>
                  <Link
                    href={!item.submenu ? item.path : undefined}
                    display="flex"
                    alignItems="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "teal.100", textDecoration: "none" }}
                    onClick={item.submenu ? toggleSubmenu : undefined}
                  >
                    <Icon as={item.icon} boxSize={5} mr={3} color="blue" />
                    <Text fontWeight="medium">{item.name}</Text>
                    {item.submenu && (
                      <Icon
                        as={submissionsOpen ? FiChevronUp : FiChevronDown}
                        ml="auto"
                        boxSize={4}
                      />
                    )}
                  </Link>
                  {item.submenu && (
                    <Collapse in={submissionsOpen} animateOpacity>
                      <VStack spacing={2} align="stretch" pl={6} mt={2}>
                        {item.submenu.map((submenu) => (
                          <Link
                            href={submenu.path}
                            key={submenu.name}
                            p={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100", textDecoration: "none" }}
                          >
                            <Text fontSize="sm">{submenu.name}</Text>
                          </Link>
                        ))}
                      </VStack>
                    </Collapse>
                  )}
                </Box>
              ))}
            </>
          )}

          {/* HR Menu */}
          {user.role === "HR" && (
            <>
              {hrMenuItems.map((item) => (
                <Box key={item.name}>
                  <Link
                    href={!item.submenu ? item.path : undefined}
                    display="flex"
                    alignItems="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "teal.100", textDecoration: "none" }}
                    onClick={
                      item.submenu.length > 0 ? toggleSubmenu : undefined
                    }
                  >
                    <Icon as={item.icon} boxSize={5} mr={3} color="blue" />
                    <Text fontWeight="medium">{item.name}</Text>
                    {item.submenu.length > 0 && (
                      <Icon
                        as={submissionsOpen ? FiChevronUp : FiChevronDown}
                        ml="auto"
                        boxSize={4}
                      />
                    )}
                  </Link>
                  {item.submenu.length > 0 && (
                    <Collapse in={submissionsOpen} animateOpacity>
                      <VStack spacing={2} align="stretch" pl={6} mt={2}>
                        {item.submenu.map((submenu) => (
                          <Link
                            href={submenu.path}
                            key={submenu.name}
                            p={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100", textDecoration: "none" }}
                          >
                            <Text fontSize="sm">{submenu.name}</Text>
                          </Link>
                        ))}
                      </VStack>
                    </Collapse>
                  )}
                </Box>
              ))}
            </>
          )}

          {/* Vendor Menu */}
          {user.role === "VENDOR" && (
            <>
              {vendorMenuItems.map((item) => (
                <Box key={item.name}>
                  <Link
                    href={item.path}
                    display="flex"
                    alignItems="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "teal.100", textDecoration: "none" }}
                  >
                    <Icon as={item.icon} boxSize={5} mr={3} color="blue" />
                    <Text fontWeight="medium">{item.name}</Text>
                  </Link>
                </Box>
              ))}
            </>
          )}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box ml={{ md: "250px" }} w="full" p={6} bg="gray.50">
        <Text fontSize="lg">{children}</Text>
      </Box>
    </Flex>
  );
}
