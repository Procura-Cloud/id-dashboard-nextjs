import { Box, Button, HStack, Input, useDisclosure } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { Text } from "@chakra-ui/react";
import { useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import CreateVendorModal from "@/components/vendor/CreateVendorModal";
import { listVendors } from "@/controllers/vendor.controller";
import { VendorType } from "@/schema/vendor.schema";
import ListVendorsTable from "@/components/vendor/ListVendorsTable";

export default function VendorPage() {
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");

  const defferedSearch = useDeferredValue(search);

  const fetchVendors = async () => {
    try {
      const vendors = await listVendors({
        params: {
          search,
        },
      });
      setVendors(vendors);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [defferedSearch]);

  return (
    <Box paddingTop="2rem">
      <Heading variant="h2" size="lg">
        Vendors
      </Heading>
      <Text>Create or delete Vendors here.</Text>

      <HStack marginTop="2rem" justifyContent={"flex-end"}>
        <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
          Add Vendor
        </Button>
      </HStack>

      <Box marginTop={"1rem"} marginBottom={"2rem"}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Vendors"
        />
      </Box>

      <ListVendorsTable data={vendors} refresh={fetchVendors} />

      <CreateVendorModal
        mode="create"
        isOpen={isOpen}
        onClose={onClose}
        refresh={fetchVendors}
      />
    </Box>
  );
}
