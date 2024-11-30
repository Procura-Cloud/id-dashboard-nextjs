import { createAdmin } from "@/controllers/admin.controller";
import { adminSchema, AdminType } from "@/schema/admin.schema";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  ButtonGroup,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { hrSchema, HRType } from "@/schema/hr.schema";
import AsyncSelect from "react-select/async";
import { candidateSchema, CandidateType } from "@/schema/candidate.schema";
import {
  createCandidate,
  requestChanges,
  updateCandidate,
} from "@/controllers/candidate.controller";
import { suggestLocations } from "@/controllers/location.controller";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface RequestChangesModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function RequestChangesModal({
  id,
  isOpen,
  onClose,
  refresh,
}: RequestChangesModalProps) {
  const [comment, setComment] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || comment === "") {
      return toast.error("Please add a comment.", {
        position: "bottom-center",
      });
    }

    try {
      const response = await requestChanges(id, {
        comment,
        token,
      });

      await refresh();
      toast.success("Changes requested successfully.", {
        position: "bottom-center",
      });
      onClose();
    } catch (error) {
      toast.error(error?.message ?? "Something went wrong.", {
        position: "bottom-center",
      });
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Comment</FormLabel>
              <Textarea
                placeholder="Add your comments here."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
            Add Comment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
