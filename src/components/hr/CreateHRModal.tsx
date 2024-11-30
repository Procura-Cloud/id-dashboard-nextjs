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
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { hrSchema, HRType } from "@/schema/hr.schema";
import { createHR } from "@/controllers/hr.controller";

export interface CreateAdminModalProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function CreateHRModal({
  mode = "create",
  isOpen,
  onClose,
  refresh,
}: CreateAdminModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<HRType>({
    resolver: zodResolver(hrSchema),
  });

  const onSubmit = async (data: HRType) => {
    try {
      if (mode === "create") {
        const response = await createHR({
          name: data.name,
          email: data.email,
        });

        toast.success("HR created successfully.", {
          position: "bottom-center",
        });

        await refresh();
      }
    } catch (error) {
      toast.error(error?.message ?? "Something went wrong.", {
        position: "bottom-center",
      });
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create HR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>HR Name</FormLabel>
                <Input placeholder="HR Name" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>HR Email</FormLabel>
                <Input placeholder="HR Email" {...register("email")} />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              colorScheme="blue"
              type="submit"
            >
              Create HR
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
