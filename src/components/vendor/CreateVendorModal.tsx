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
  Select,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { vendorSchema, VendorType } from "@/schema/vendor.schema";
import { createVendor, updateVendor } from "@/controllers/vendor.controller";
import { stateData } from "@/constants/countries";
import { useMemo } from "react";

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
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<VendorType>({
    defaultValues: {
      id: data?.id ?? null,
      name: data?.name ?? "",
      email: data?.email ?? "",
      phoneNumber: data?.phoneNumber ?? "",
      city: data?.city ?? "",
      state: data?.state ?? "",
    },
    mode: "onChange",
    resolver: zodResolver(vendorSchema),
  });

  const state = watch("state");

  const cities = useMemo(() => {
    const cityData = stateData[state];

    return cityData ? cityData : [];
  }, [state]);

  const onSubmit = async (data: VendorType) => {
    try {
      if (mode === "create") {
        await createVendor({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          city: data.city,
          state: data.state,
        });

        toast.success("Admin created successfully.", {
          position: "bottom-center",
        });
      }

      if (mode === "edit") {
        await updateVendor(data.id, {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });

        toast.success("Admin updated successfully.", {
          position: "bottom-center",
        });
      }

      await refresh();
      reset();
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

              <FormControl isInvalid={!!errors.state}>
                <FormLabel>State</FormLabel>
                <Select {...register("state")}>
                  <option value=""> Select a state</option>
                  {Object.keys(stateData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
                {errors.state && (
                  <FormErrorMessage>{errors.state.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Select {...register("city")}>
                  <option value=""> Select a city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                {errors.city && (
                  <FormErrorMessage>{errors.city.message}</FormErrorMessage>
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
