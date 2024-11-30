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
import { hrSchema, HRType } from "@/schema/hr.schema";
import AsyncSelect from "react-select/async";
import { candidateSchema, CandidateType } from "@/schema/candidate.schema";
import {
  createCandidate,
  updateCandidate,
} from "@/controllers/candidate.controller";
import { suggestLocations } from "@/controllers/location.controller";

export interface AddCandidateModalProps {
  mode: "create" | "edit";
  data?: CandidateType;
  isOpen: boolean;
  onClose: () => void;
  fetchData?: () => Promise<void>;
  refresh?: () => Promise<void>;
}

export default function AddCandidateModal({
  mode = "create",
  isOpen,
  data = {},
  onClose,

  refresh = async () => {},
}: AddCandidateModalProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CandidateType>({
    defaultValues: {
      id: data.id,
      name: data.name,
      email: data.email,
      employeeID: data.employeeID,
      location: data.location,
    },
    resolver: zodResolver(candidateSchema),
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
          name: data.name,
          email: data.email,
          employeeID: data.employeeID,
          locationID: data.location.value,
        });

        toast.success("Candidate created successfully.", {
          position: "bottom-center",
        });
      }

      if (mode === "edit") {
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
      toast.error(error?.message ?? "Something went wrong.", {
        position: "bottom-center",
      });
      console.error(error);
    } finally {
      onClose();
    }
  };

  const handleSelect = (selectedOption) => {
    console.log("Selected:", selectedOption);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {mode === "create" ? "Create" : "Edit"} Candidate
          </ModalHeader>
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
              isDisabled={!isValid || isSubmitting}
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
