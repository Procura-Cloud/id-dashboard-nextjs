import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Input,
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

export default function Admin() {
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
    <Box paddingTop="2rem">
      <HStack justifyContent="space-between">
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

        <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
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
  );
}
