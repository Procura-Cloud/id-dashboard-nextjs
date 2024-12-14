import {
  approveCandidate,
  listSumbmissions,
} from "@/controllers/candidate.controller";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
  useDisclosure,
  Box,
  HStack,
  Tag,
  Input,
} from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { use, useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera, FaEdit, FaEye } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import AddCandidateModal from "./AddCandidateModal";
import RequestChangesModal from "./RequestChanges";
import PaginationRow from "../common/PaginationRow";
import NoResults from "../common/NoResults";
import { useAuth } from "@/context/AuthContext";
import ViewModal from "../submission/ViewModal";
import { FiLoader } from "react-icons/fi";
import OpenSubmissionPanel from "../submission/OpenSubmissionPanel";

export function SubmissionCard({
  id,
  src,
  name,
  employeeID,
  email,
  location,
  status,
  stage,
  refresh,
  vendor,
}: {
  id: number;
  src: string;
  name: string;
  employeeID: string;
  email: string;
  location?: {
    value: string;
    label: string;
  };
  status: string;
  stage: string;
  vendor: any;
  refresh: () => Promise<void>;
}) {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isRequestChangesOpen,
    onOpen: onRequestChangesOpen,
    onClose: onRequestChangesClose,
  } = useDisclosure();

  const {
    isOpen: isViewCardOpen,
    onOpen: onViewCardOpen,
    onClose: onViewCardClose,
  } = useDisclosure();

  const {
    isOpen: isOpenSubmissionOpen,
    onOpen: onOpenSubmissionOpen,
    onClose: onOpenSubmissionClose,
  } = useDisclosure();

  const { user } = useAuth();

  const handleApprove = async () => {
    try {
      const response = await approveCandidate(id);

      toast.success("Candidate approved successfully.", {
        position: "bottom-center",
      });

      await refresh();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      }

      console.error(error);
    }
  };

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      width="100%"
      mb="4"
      border="0.05px solid #c5c6c8"
    >
      <Box
        sx={{
          justifySelf: "center",
          width: "175px",
          minHeight: "100%",
          backgroundColor: "gray.300",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        {!src ? (
          <FaCamera />
        ) : (
          <Image
            src={src}
            objectFit="cover"
            alt="ID Card"
            width="100%"
            height="100%"
          />
        )}
      </Box>

      <Stack>
        <CardBody>
          <Heading size="md">{name}</Heading>

          <Text mt="2">Employee ID: {employeeID}</Text>
          <Text>Email: {email}</Text>
          <Text>Location: {location?.label ?? "-"}</Text>
          <Text>
            Status:
            <Tag ml="2" color="teal" colorScheme="teal">
              {status}
            </Tag>
          </Text>
          <Text>
            Stage:
            {stage === "VENDOR" ? `${vendor?.name ?? "-"} (VENDOR)` : stage}
          </Text>
        </CardBody>

        <CardFooter as={HStack}>
          {(user.role === "ADMIN" || user.role === "HR") &&
            (stage === "HR" || stage === "CANDIDATE") && (
              <Button
                leftIcon={<FaEdit />}
                variant="solid"
                colorScheme="blue"
                onClick={onEditOpen}
              >
                Edit Submission
              </Button>
            )}
          {(user.role === "ADMIN" || user.role === "HR") &&
            (stage === "CANDIDATE" || stage === "HR") && (
              <Button
                leftIcon={<FaComment />}
                variant="solid"
                colorScheme="blue"
                onClick={onRequestChangesOpen}
              >
                Request Changes
              </Button>
            )}

          {src && (
            <Button
              leftIcon={<FaEye />}
              variant="solid"
              colorScheme="blue"
              onClick={onViewCardOpen}
            >
              View Card
            </Button>
          )}

          {(user.role === "ADMIN" || user.role === "HR") && stage === "HR" && (
            <Button
              leftIcon={<TiTick />}
              variant="solid"
              colorScheme="blue"
              onClick={handleApprove}
            >
              Approve
            </Button>
          )}

          {user.role === "ADMIN" &&
            (status === "DONE" || status === "REJECTED") && (
              <Button
                leftIcon={<FiLoader />}
                variant="solid"
                colorScheme="blue"
                onClick={onOpenSubmissionOpen}
              >
                Open Again
              </Button>
            )}
        </CardFooter>
      </Stack>

      <AddCandidateModal
        mode="edit"
        title="Edit Candidate"
        data={{
          id,
          name,
          email,
          employeeID,
          location,
        }}
        isOpen={isEditOpen}
        onClose={onEditClose}
        refresh={refresh}
      />

      <RequestChangesModal
        id={id}
        isOpen={isRequestChangesOpen}
        onClose={onRequestChangesClose}
        refresh={refresh}
      />

      <ViewModal
        data={{ id }}
        isOpen={isViewCardOpen}
        onClose={onViewCardClose}
      />

      <OpenSubmissionPanel
        submission={{ id }}
        isOpen={isOpenSubmissionOpen}
        onClose={onOpenSubmissionClose}
      />
    </Card>
  );
}

export default function HRSubmissionPanel() {
  const [submissions, setSubmissions] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useQueryState("search");
  const { user } = useAuth();

  const defferedSearch = useDeferredValue(search);

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
  return (
    <>
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
    </>
  );
}
