import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Input,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { Text } from "@chakra-ui/react";
import CreateAdminModal from "@/components/admin/CreateAdminModal";
import { useDeferredValue, useEffect, useState } from "react";
import { AdminType } from "@/schema/admin.schema";
import { listAdmins } from "@/controllers/admin.controller";
import { toast } from "react-toastify";
import ListAdminTable from "@/components/admin/ListAdminTable";
import { useQueryState } from "nuqs";
import { ChevronRightIcon } from "@chakra-ui/icons";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { user, loading } = useAuth();

  const router = useRouter();

  const defferedSearch = useDeferredValue(search);

  const fetchAdmins = async () => {
    try {
      const admins = await listAdmins({
        params: {
          search,
        },
      });
      setAdmins(admins);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [defferedSearch]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!user && !loading) {
      router.push("/login");
    }
  }, []);

  if (!user || loading) {
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

  return (
    <MainLayout>
      <Box paddingTop="2rem">
        <HStack justifyContent="space-between" alignItems="center">
          <Breadcrumb
            size="sm"
            fontSize="sm"
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admins</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Avatar name={user.name} />
        </HStack>
        <Heading variant="h2" size="lg" mt="4">
          Admins
        </Heading>
        <Text>Create or delete admins here.</Text>

        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
            Add Admin
          </Button>
        </HStack>

        <Box marginTop={"1rem"} marginBottom={"2rem"}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Admins"
          />
        </Box>

        <ListAdminTable refresh={fetchAdmins} data={admins} />

        <CreateAdminModal
          mode="create"
          isOpen={isOpen}
          onClose={onClose}
          refresh={fetchAdmins}
        />
      </Box>
    </MainLayout>
  );
}
