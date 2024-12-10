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

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { user, loading } = useAuth();

  const router = useRouter();

  const fetchSubmissions = async () => {
    try {
      const submissions = await listSumbmissions({
        params: {
          search,
        },
      });
      setSubmissions(submissions);
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
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    if ((!user && !loading) || (user && user.role !== "ADMIN")) {
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
              <BreadcrumbLink href="/admin">Submissions</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Avatar name={user.name} />
        </HStack>
        <Heading variant="h2" size="lg">
          Submissions
        </Heading>
        <Text>Create or delete submissions here.</Text>

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
                locationId={submission.locationId}
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
