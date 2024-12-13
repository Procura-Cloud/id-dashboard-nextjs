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
import CreateHRModal from "@/components/hr/CreateHRModal";
import ListHRTable from "@/components/hr/ListHRTable";
import { HRType } from "@/schema/hr.schema";
import { listHRs } from "@/controllers/hr.controller";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import NoResults from "@/components/common/NoResults";
import { SubmissionCard } from "@/components/hr/HRSubmissionPanel";
import { listSumbmissions } from "@/controllers/candidate.controller";
import Pagination from "@/components/common/ProtectedRoute";
import usePagination from "@/hooks/Pagination";
import AddCandidateModal from "@/components/hr/AddCandidateModal";
import withProtection from "@/components/common/ProtectedRoute";
import PaginationComponent from "@/components/common/PaginationRow";

function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const {
    isOpen: isAddCandidateOpen,
    onClose: onAddCandidateClose,
    onOpen: onAddCandidateOpen,
  } = useDisclosure();
  const {
    isOpen: isLostAndFoundOpen,
    onClose: onLostAndFoundClose,
    onOpen: onLostAndFoundOpen,
  } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const [total, setTotal] = useState(0);
  const { currentPage, prevPage, nextPage } = usePagination(submissions.length);

  const { user } = useAuth();

  const defferedSearch = useDeferredValue(search);

  const fetchSubmissions = async () => {
    try {
      const submissions = await listSumbmissions({
        params: {
          search,
          page: currentPage,
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

  useEffect(() => {
    fetchSubmissions();

    const intervalId = setInterval(() => {
      fetchSubmissions(); // Revalidate periodically
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [defferedSearch, currentPage]);

  return (
    <MainLayout
      title="Submissions"
      content="Create or edit submissions here."
      path={["Dashboard", "Submissions"]}
    >
      <Box paddingTop="2rem">
        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          {(user.role === "ADMIN" || user.role === "HR") && (
            <Button
              leftIcon={<IoMdAdd />}
              colorScheme="blue"
              onClick={onAddCandidateOpen}
            >
              Add Candidate
            </Button>
          )}

          {user.role === "ADMIN" && (
            <Button
              leftIcon={<IoMdAdd />}
              colorScheme="blue"
              onClick={onLostAndFoundOpen}
            >
              Lost and Found Application
            </Button>
          )}
        </HStack>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Submissions"
          my="4"
        />

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

      <AddCandidateModal
        mode="create"
        title="Create New Application"
        isOpen={isAddCandidateOpen}
        onClose={onAddCandidateClose}
      />
      <AddCandidateModal
        mode="create"
        title="Create Lost and Found Application"
        data={{
          type: "LOST_AND_FOUND",
        }}
        isOpen={isLostAndFoundOpen}
        onClose={onLostAndFoundClose}
      />
    </MainLayout>
  );
}

export default withProtection(AdminSubmissionsPage);
