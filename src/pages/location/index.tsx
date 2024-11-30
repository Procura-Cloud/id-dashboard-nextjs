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
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import CreateLocationModal from "@/components/location/CreateLocationModal";
import ListLocationTable from "@/components/location/ListLocationTable";
import { LocationType } from "@/schema/location.schema";
import { listLocations } from "@/controllers/location.controller";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";

export default function VendorPage() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { user } = useAuth();

  const defferedSearch = useDeferredValue(search);

  const fetchLocations = async () => {
    try {
      const locations = await listLocations({
        params: {
          search,
        },
      });
      setLocations(locations);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fetchLocations();
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
            <BreadcrumbLink href="/locations">Locations</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Avatar name={user.name} />
      </HStack>

      <Heading variant="h2" size="lg">
        Locations
      </Heading>
      <Text>Create or delete Office locations here.</Text>

      <HStack marginTop="2rem" justifyContent={"flex-end"}>
        <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
          Add Location
        </Button>
      </HStack>

      <Box marginTop={"1rem"} marginBottom={"2rem"}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Locations"
        />
      </Box>

      <ListLocationTable data={locations} refresh={fetchLocations} />

      <CreateLocationModal
        mode="create"
        isOpen={isOpen}
        onClose={onClose}
        refresh={fetchLocations}
      />
    </Box>
  );
}
