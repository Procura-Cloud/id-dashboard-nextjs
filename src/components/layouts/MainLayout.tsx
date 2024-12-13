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
  Container,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { TfiLocationPin, TfiShoppingCart } from "react-icons/tfi";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaPerson } from "react-icons/fa6";
import Head from "next/head";

export default function MainLayout({
  title,
  content,
  children,
  path = [],
}: {
  title: string;
  content: string;
  path: string[];
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

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
    { name: "Locations", icon: TfiLocationPin, path: "/admin/location" },
    { name: "Vendors", icon: TfiShoppingCart, path: "/admin/vendor" },
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
    {
      name: "Submissions",
      icon: FiSettings,
      path: "/vendor/submissions",
      submenu: [
        { name: "Assigned Submissions", path: "/vendor/submissions/assigned" },
        {
          name: "Completed Submissions",
          path: "/vendor/submissions/completed",
        },
      ],
    },
  ];

  const toggleSubmenu = () => setSubmissionsOpen(!submissionsOpen);

  return (
    <Flex minHeight="100vh" width="100%">
      <Head>
        <title>{title}</title>
      </Head>
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
        minHeight="100vh"
        bg="white"
        boxShadow="xl"
        zIndex="overlay"
        overflowX="hidden"
        position={{ sm: "fixed", md: "relative" }}
        transition="width 0.2s ease"
        borderRight="0.01px solid #b4b6b3"
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
        </VStack>
      </Box>

      {/* Main Content */}
      <Box px="8" flex="1" mt="4">
        <HStack justifyContent="space-between" alignItems="center">
          <Breadcrumb
            size="sm"
            fontSize="sm"
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            {path.map((p) => (
              <BreadcrumbItem>
                <BreadcrumbLink href="#" key={p}>
                  {p}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>

          <Menu>
            <MenuButton
              as={Button}
              height="fit-content"
              p="2"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar name={user.name} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Heading variant="h2" size="lg" mt="4">
          {title}
        </Heading>
        <Text>{content}</Text>
        {children}
      </Box>
    </Flex>
  );
}
