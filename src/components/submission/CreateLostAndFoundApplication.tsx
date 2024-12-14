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
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { CandidateType, lostAndFoundSchema } from "@/schema/candidate.schema";
import {
  createCandidate,
  updateCandidate,
} from "@/controllers/candidate.controller";
import { suggestLocations } from "@/controllers/location.controller";
import { useEffect } from "react";

export interface CreateLostAndFoundPropsProps {
  mode: "create" | "edit";
  title?: string;
  data?: CandidateType;
  isOpen: boolean;
  onClose: () => void;
  fetchData?: () => Promise<void>;
  refresh?: () => Promise<void>;
}

export default function CreateLostAndFoundProps({
  mode = "create",
  title = "Create New Application",
  isOpen,
  data = {},
  onClose,
  refresh = async () => {},
}: CreateLostAndFoundPropsProps) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CandidateType>({
    resolver: zodResolver(lostAndFoundSchema),
    mode: "onBlur",
  });

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const data = await suggestLocations({
        params: {
          search: inputValue,
        },
      });

      return data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  const onSubmit = async (data: CandidateType) => {
    try {
      if (mode === "create") {
        const response = await createCandidate({
          type: data.type,
          name: data.name,
          email: data.email,
          photoUrl: data.photoUrl,
          employeeID: data.employeeID,
          locationID: data.location?.value,
        });

        toast.success("Candidate created successfully.", {
          position: "bottom-center",
        });
      }

      if (mode === "edit") {
        console.log(data);
        const response = await updateCandidate(data.id, {
          name: data.name,
          email: data.email,
          employeeID: data.employeeID,
          locationID: data.location.value,
        });

        toast.success("Candidate updated successfully.", {
          position: "bottom-center",
        });
      }

      await refresh();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      }
      console.error(error);
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    reset({
      id: data.id,
      type: data.type,
      name: data.name,
      email: data.email,
      employeeID: data.employeeID,
      location: data.location,
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Candidate Name</FormLabel>
                <Input placeholder="Candidate Name" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Candidate Email</FormLabel>
                <Input placeholder="Candidate Email" {...register("email")} />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.employeeID}>
                <FormLabel>Employee ID</FormLabel>
                <Input
                  placeholder="Candidate Employee ID"
                  {...register("employeeID")}
                />
                {errors.employeeID && (
                  <FormErrorMessage>
                    {errors.employeeID.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field} // Spread the field object for value and onChange handling
                      cacheOptions
                      loadOptions={loadOptions}
                      onChange={field.onChange}
                      placeholder="Search items..."
                      value={field.value} // Ensure the correct value is displayed
                    />
                  )}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!isValid}
              isLoading={isSubmitting}
              colorScheme="blue"
              type="submit"
            >
              {mode === "create" ? "Create" : "Edit"} Candidate
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
