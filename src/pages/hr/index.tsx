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
import { useDeferredValue, useEffect, useState } from "react";
import { AdminType } from "@/schema/admin.schema";
import { listAdmins } from "@/controllers/admin.controller";
import { toast } from "react-toastify";
import ListAdminTable from "@/components/admin/ListAdminTable";
import { useQueryState } from "nuqs";
import CreateHRModal from "@/components/hr/CreateHRModal";
import ListHRTable from "@/components/hr/ListHRTable";
import { HRType } from "@/schema/hr.schema";
import { listHRs } from "@/controllers/hr.controller";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";

export default function HRPage() {
  const [hrs, setHRs] = useState<HRType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { user } = useAuth();

  const defferedSearch = useDeferredValue(search);

  const fetchHRs = async () => {
    try {
      const hrs = await listHRs({
        params: {
          search,
        },
      });
      setHRs(hrs);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fetchHRs();
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
            <BreadcrumbLink href="/admin">HRs</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Avatar name={user.name} />
      </HStack>
      <Heading variant="h2" size="lg">
        HRs
      </Heading>
      <Text>Create or delete Human Resource Managers here.</Text>

      {user.role === "ADMIN" && (
        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
            Add HR
          </Button>
        </HStack>
      )}

      <Box marginTop={"1rem"} marginBottom={"2rem"}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search HRs"
        />
      </Box>

      <ListHRTable refresh={fetchHRs} data={hrs} />

      <CreateHRModal
        mode="create"
        isOpen={isOpen}
        onClose={onClose}
        refresh={fetchHRs}
      />
    </Box>
  );
}