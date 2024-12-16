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
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { candidateSchema, CandidateType } from "@/schema/candidate.schema";
import {
  createCandidate,
  updateCandidate,
} from "@/controllers/candidate.controller";
import { suggestLocations } from "@/controllers/location.controller";
import { useEffect, useState } from "react";

export interface AddCandidateModalProps {
  mode: "create" | "edit";
  title?: string;
  data?: CandidateType;
  isOpen: boolean;
  onClose: () => void;
  fetchData?: () => Promise<void>;
  refresh?: () => Promise<void>;
}

export default function AddCandidateModal({
  mode = "create",
  title = "Create New Application",
  isOpen,
  data = {},
  onClose,
  refresh = async () => {},
}: AddCandidateModalProps) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CandidateType>({
    resolver: zodResolver(candidateSchema),
  });

  const [defaultLocations, setDefaultLocations] = useState<
    { label: string; value: string }[]
  >([]);

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
        console.log("Candidate Data", data);
        const response = await updateCandidate(data.id, {
          name: data.name,
          email: data.email,
          employeeID: data.employeeID,
          locationID: data.location && data.location.value,
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
    suggestLocations().then((locations) => {
      setDefaultLocations(locations);
    });
  }, []);

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
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field} // Spread the field object for value and onChange handling
                      cacheOptions
                      defaultOptions={defaultLocations}
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
