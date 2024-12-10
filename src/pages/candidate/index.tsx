import IDCardView from "@/components/common/IDCardView";
import { useAuth } from "@/context/AuthContext";
import {
  getCandidateForm,
  verifyCandidate,
} from "@/controllers/candidate.controller";
import { CandidateType } from "@/schema/candidate.schema";
import { Alert, AlertIcon, Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CandidatePage() {
  const router = useRouter();
  const [data, setData] = useState<CandidateType>({});

  const verifyToken = async () => {
    const token = router.query.token as string;

    if (!router.isReady) return;

    if (!token) {
      toast.error("Invalid token.", {
        position: "bottom-center",
      });

      return;
    }

    try {
      const { id, email } = await verifyCandidate(token);

      const candidate = await getCandidateForm(id);

      setData(candidate);

      toast.success("Token verified successfully.", {
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, while verifying token.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    verifyToken();
  }, [router.query]); // Add dependency to ensure it re-runs when `token` is available

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
      }}
    >
      <Box
        border="0.5px solid #ccc"
        padding="3rem 2rem"
        sx={{
          width: "min(90%, 720px)",
          borderRadius: "1rem",
        }}
      >
        <Heading>Complete your profile</Heading>
        <Text>Complete your ID Application card here.</Text>

        <Alert status="info" my="4">
          <AlertIcon />
          Instructions:
        </Alert>

        {router.isReady && (
          <IDCardView data={data} token={router.query.token as string} />
        )}
      </Box>
    </Box>
  );
}
