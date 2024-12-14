import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { Text } from "@chakra-ui/react";
import { useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import CreateHRModal from "@/components/hr/CreateHRModal";
import ListHRTable from "@/components/hr/ListHRTable";
import { HRType } from "@/schema/hr.schema";
import { listHRs } from "@/controllers/hr.controller";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import NoResults from "@/components/common/NoResults";
import { SubmissionCard } from "@/components/hr/HRSubmissionPanel";
import { listSumbmissions } from "@/controllers/candidate.controller";
import AddCandidateModal from "@/components/hr/AddCandidateModal";
import withProtection from "@/components/common/ProtectedRoute";
import usePagination from "@/hooks/Pagination";
import PaginationComponent from "@/components/common/PaginationRow";
import AsyncSelect from "react-select/async";
import { suggestLocations } from "@/controllers/location.controller";

function HRSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const defferedSearch = useDeferredValue(search);
  const { user } = useAuth();

  const { currentPage, nextPage, prevPage } = usePagination(submissions.length);

  // Filters
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");

  const fetchSubmissions = async () => {
    try {
      const submissions = await listSumbmissions({
        params: {
          search,
          page: currentPage,
          ...(status && { status }),
          ...(stage && { stage }),
          ...(location && { location: location.value }),
        },
      });
      setSubmissions(submissions.results);
      setTotal(submissions.total);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const data = await suggestLocations({
        params: {
          search: inputValue,
        },
      });

      return data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchSubmissions();

    const intervalId = setInterval(() => {
      fetchSubmissions(); // Revalidate periodically
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentPage, defferedSearch, status, stage, location]);

  return (
    <MainLayout
      title="Submissions"
      content="Create or edit submissions here."
      path={["Dashboard", "Submissions"]}
    >
      <Box paddingTop="2rem">
        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          {(user.role === "ADMIN" || user.role === "HR") && (
            <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
              Add Candidate
            </Button>
          )}
        </HStack>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Submissions"
          my="4"
        />

        {/* Filters */}
        <HStack mb="4" flexDirection={{ sm: "column", md: "row" }}>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="NEED_CHANGES">Need Changes</option>
              <option value="DONE">Done</option>
              <option value="REJECTED">Rejected</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Stage</FormLabel>
            <Select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">All</option>
              <option value="CANDIDATE">Candidate</option>
              <option value="HR">HR</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Location</FormLabel>
            <AsyncSelect
              cacheOptions
              isClearable
              value={location} // Ensure the correct value is displayed
              loadOptions={loadOptions}
              onChange={(e) => setLocation(e)}
              placeholder="Search items..."
            />
          </FormControl>
        </HStack>

        {/* Pagination */}
        <PaginationComponent
          total={total}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />

        <Box>
          {submissions.length === 0 && (
            <NoResults message="No submissions found." />
          )}

          {submissions.map((submission) => (
            <>
              <SubmissionCard
                key={submission.id}
                id={submission.id}
                src={submission.photoUrl}
                status={submission.status || "-"}
                name={submission.name}
                employeeID={submission.employeeID || "-"}
                email={submission.email}
                stage={submission.stage || "-"}
                vendor={submission.vendor ? submission.vendor.name : "-"}
                location={
                  submission.location && {
                    value: submission.location.id,
                    label: submission.location.slug,
                  }
                }
                refresh={fetchSubmissions}
              />
            </>
          ))}
        </Box>
      </Box>

      <AddCandidateModal mode="create" isOpen={isOpen} onClose={onClose} />
    </MainLayout>
  );
}

export default withProtection(HRSubmissionsPage);
