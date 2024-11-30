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
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export interface CreateAdminModalProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function CreateAdminModal({
  mode = "create",
  isOpen,
  onClose,
  refresh,
}: CreateAdminModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AdminType>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminType) => {
    try {
      if (mode === "create") {
        await createAdmin({
          name: data.name,
          email: data.email,
        });

        toast.success("Admin created successfully.", {
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
          <ModalHeader>Create Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Admin Name</FormLabel>
                <Input placeholder="Admin Name" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Admin Email</FormLabel>
                <Input placeholder="Admin Email" {...register("email")} />
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
              Create Admin
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
