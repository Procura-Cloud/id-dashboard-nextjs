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
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { hrSchema, HRType } from "@/schema/hr.schema";
import { createHR } from "@/controllers/hr.controller";
import { locationSchema, LocationType } from "@/schema/location.schema";
import {
  createLocation,
  updateLocation,
} from "@/controllers/location.controller";
import { useEffect } from "react";

export interface CreateLocationModalProps {
  mode: "create" | "edit";
  data?: LocationType | null;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function CreateLocationModal({
  mode = "create",
  data = {},
  isOpen,
  onClose,
  refresh,
}: CreateLocationModalProps) {
  console.log("Data", data);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LocationType>({
    defaultValues: {
      id: data?.id ?? "",
      slug: data?.slug ?? "",
      preFormattedAddress: data?.preFormattedAddress ?? "",
    },
    resolver: zodResolver(locationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LocationType) => {
    try {
      if (mode === "create") {
        const response = await createLocation({
          slug: data.slug,
          preFormattedAddress: data.preFormattedAddress,
        });

        toast.success("Location created successfully.", {
          position: "bottom-center",
        });
      }

      if (mode === "edit") {
        const response = await updateLocation(data.id, {
          preFormattedAddress: data.preFormattedAddress,
        });

        toast.success("Location updated successfully.", {
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
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!errors.slug}>
                <FormLabel>Office Name</FormLabel>
                <Input placeholder="Office Name" {...register("slug")} />
                {errors.slug && (
                  <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.preFormattedAddress}>
                <FormLabel>Office Address</FormLabel>
                <Textarea
                  placeholder="Enter the office address here"
                  {...register("preFormattedAddress")}
                />
                {errors.preFormattedAddress && (
                  <FormErrorMessage>
                    {errors.preFormattedAddress.message}
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
              {mode === "create" ? "Create" : "Update"} Location
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
