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
  VStack,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { sendToVendor } from "@/controllers/candidate.controller";
import { suggestVendor } from "@/controllers/vendor.controller";
import { useEffect, useState } from "react";

export interface SendToVendorModalProps {
  mode: "create" | "edit";
  applications: string[];
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
}

export default function SendToVendorModal({
  isOpen,
  applications,
  onClose,
  refresh,
}: SendToVendorModalProps) {
  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  const [defaultVendors, setDefaultVendors] = useState<
    { label: string; value: string }[]
  >([]);

  // Function to load options asynchronously
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];

    try {
      const data = await suggestVendor({ params: { search: inputValue } });
      // Assuming data is an array of vendor objects like { name: "Vendor A", id: "1" }

      setOptions(data); // Set options in state
      return data;
    } catch (error) {
      console.error("Error fetching vendor options:", error);
      return [];
    }
  };

  // Handle when a vendor is selected
  const handleSelect = (selectedOption: { label: string; value: string }) => {
    setSelectedVendor(selectedOption); // Update the selected vendor in state
  };

  useEffect(() => {
    suggestVendor().then((vendors) => {
      setDefaultVendors(vendors);
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Submitting {applications.length} application
          {applications.length > 1 ? "s" : ""} to vendor.
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Location</FormLabel>
              {/* AsyncSelect for vendor selection */}
              <AsyncSelect
                cacheOptions
                defaultOptions={defaultVendors} // Display options if available
                loadOptions={loadOptions}
                onChange={handleSelect}
                value={selectedVendor} // Bind selected vendor value
                placeholder="Search for vendors..."
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={async () => {
              try {
                await sendToVendor(applications, selectedVendor.value);

                toast.success("Applications sent to vendor.", {
                  position: "bottom-center",
                });
                onClose();

                await refresh();
              } catch (error) {
                console.error(error);

                if (error.response) {
                  toast.error(error.response.data.message, {
                    position: "bottom-center",
                  });
                }
              }
            }}
          >
            Send Applications to Vendor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
