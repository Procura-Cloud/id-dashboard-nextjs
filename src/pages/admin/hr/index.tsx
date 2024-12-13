import { Box, Button, HStack, Input, useDisclosure } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import CreateHRModal from "@/components/hr/CreateHRModal";
import ListHRTable from "@/components/hr/ListHRTable";
import { HRType } from "@/schema/hr.schema";
import { listHRs } from "@/controllers/hr.controller";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import withProtection from "@/components/common/ProtectedRoute";

function HRPage() {
  const [hrs, setHRs] = useState<HRType[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");

  const router = useRouter();

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
    <MainLayout
      title="HRs"
      content="Create or delete Human Resource Managers here."
      path={["Dashboard", "HRs"]}
    >
      <Box paddingTop="2rem">
        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
            Add HR
          </Button>
        </HStack>

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
    </MainLayout>
  );
}

export default withProtection(HRPage);
