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
import { useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import CreateLocationModal from "@/components/location/CreateLocationModal";
import ListLocationTable from "@/components/location/ListLocationTable";
import { LocationType } from "@/schema/location.schema";
import { listLocations } from "@/controllers/location.controller";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import withProtection from "@/components/common/ProtectedRoute";
import PaginationComponent from "@/components/common/PaginationRow";
import usePagination from "@/hooks/Pagination";

function LocationPage() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { currentPage, nextPage, prevPage, goToPage } = usePagination(
    locations.length
  );
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  const defferedSearch = useDeferredValue(search);

  const fetchLocations = async () => {
    try {
      const locations = await listLocations({
        params: {
          search,
        },
      });
      setLocations(locations.results);
      setTotal(locations.total);
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
    <MainLayout
      title="Locations"
      content="Create or delete Office locations here."
      path={["Dashboard", "Locations"]}
    >
      <Box paddingTop="2rem">
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

        <PaginationComponent
          total={total}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
        <ListLocationTable data={locations} refresh={fetchLocations} />

        <CreateLocationModal
          mode="create"
          isOpen={isOpen}
          onClose={onClose}
          refresh={fetchLocations}
        />
      </Box>
    </MainLayout>
  );
}

export default withProtection(LocationPage);
