// pages/success.js
import {
  Box,
  Text,
  Button,
  Center,
  Icon,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import ViewModal from "@/components/submission/ViewModal";

export default function SuccessPage() {
  const router = useRouter();
  const [id, setId] = useQueryState("id");

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center height="100vh" bg="gray.50">
      <Box
        p={8}
        maxW="400px"
        w="full"
        boxShadow="lg"
        bg="white"
        borderRadius="lg"
        textAlign="center"
      >
        <Icon as={CheckCircleIcon} boxSize={12} color="green.400" mb={4} />
        <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={4}>
          Application Submitted Successfully!
        </Text>
        <Text color="gray.600" mb={6}>
          Thank you for submitting your application. We will review it and get
          back to you soon. You can now close this tab.
        </Text>
        <VStack>
          {id && (
            <Button colorScheme="teal" onClick={onOpen}>
              View ID Card
            </Button>
          )}
        </VStack>
      </Box>

      <ViewModal data={{ id }} isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}
