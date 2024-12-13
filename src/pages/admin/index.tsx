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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import withProtection from "@/components/common/ProtectedRoute";

function AdminPage() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");

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

  return (
    <MainLayout
      title="Admins"
      content="Add or delete admins here."
      path={["Dashboard", "Admins"]}
    >
      <Box paddingTop="2rem">
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

export default withProtection(AdminPage);
