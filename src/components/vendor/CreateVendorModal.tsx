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
import { vendorSchema, VendorType } from "@/schema/vendor.schema";
import { createVendor, updateVendor } from "@/controllers/vendor.controller";

export interface CreateVendorModalProps {
  mode: "create" | "edit";
  isOpen: boolean;
  data?: any;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function CreateVendorModal({
  mode = "create",
  data = {},
  isOpen,
  onClose,
  refresh,
}: CreateVendorModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<VendorType>({
    defaultValues: {
      id: data?.id ?? null,
      name: data?.name ?? "",
      email: data?.email ?? "",
      phoneNumber: data?.phoneNumber ?? "",
    },
    resolver: zodResolver(vendorSchema),
  });

  const onSubmit = async (data: VendorType) => {
    try {
      if (mode === "create") {
        const response = await createVendor({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });

        toast.success("Admin created successfully.", {
          position: "bottom-center",
        });
      }

      if (mode === "edit") {
        const response = await updateVendor(data.id, {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });

        toast.success("Admin updated successfully.", {
          position: "bottom-center",
        });
      }

      await refresh();
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
          <ModalHeader>Create Vendor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Vendor Name</FormLabel>
                <Input placeholder="Vendor Name" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isReadOnly={mode === "edit"}
                isDisabled={mode === "edit"}
                isRequired
                isInvalid={!!errors.email}
              >
                <FormLabel>Vendor Email</FormLabel>
                <Input placeholder="Vendor Email" {...register("email")} />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.phoneNumber}>
                <FormLabel>Vendor Phone Number</FormLabel>
                <Input
                  placeholder="Vendor Phone Number"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <FormErrorMessage>
                    {errors.phoneNumber.message}
                  </FormErrorMessage>
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
              {mode === "create" ? "Create" : "Update"} Vendor
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
