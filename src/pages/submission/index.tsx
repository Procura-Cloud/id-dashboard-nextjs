import {
  Box,
  Button,
  HStack,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { Text } from "@chakra-ui/react";
import { useDeferredValue, useEffect } from "react";
import HRSumbmissionPanel from "@/components/hr/HRSubmissionPanel";
import { useQueryState } from "nuqs";
import AddCandidateModal from "@/components/hr/AddCandidateModal";
import { useAuth } from "@/context/AuthContext";
import ApprovalPanel from "@/components/submission/ApprovalPanel";
import AssignedPanel from "@/components/submission/AssignedPanel";
import CompletedPanel from "@/components/submission/CompletedPanel";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";

export default function SubmissionPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    if (!user && !loading) {
      router.push("/login");
    }
  }, []);

  if (loading || !user) {
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
        <Heading variant="h2" size="lg">
          Submission
        </Heading>
        <Text>Create, edit, or delete submissions here.</Text>

        <HStack marginTop="2rem" justifyContent={"flex-end"}>
          {(user.role === "ADMIN" || user.role === "HR") && (
            <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={onOpen}>
              Add Candidate
            </Button>
          )}
        </HStack>

        <Tabs>
          <TabList>
            {(user.role === "ADMIN" || user.role === "HR") && (
              <Tab>Submissions</Tab>
            )}
            {user.role === "ADMIN" && <Tab>Approvals</Tab>}
            {user.role === "VENDOR" && <Tab>Assigned</Tab>}
            {user.role === "ADMIN" && <Tab>Completed</Tab>}
          </TabList>

          <TabPanels>
            {(user.role === "ADMIN" || user.role === "HR") && (
              <TabPanel>
                <HRSumbmissionPanel />
              </TabPanel>
            )}
            {user.role === "ADMIN" && (
              <TabPanel>
                <ApprovalPanel />
              </TabPanel>
            )}
            {user.role === "VENDOR" && (
              <TabPanel>
                <AssignedPanel />
              </TabPanel>
            )}
            {user.role === "ADMIN" && (
              <TabPanel>
                <CompletedPanel />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>

        <AddCandidateModal mode="create" isOpen={isOpen} onClose={onClose} />
      </Box>
    </MainLayout>
  );
}
