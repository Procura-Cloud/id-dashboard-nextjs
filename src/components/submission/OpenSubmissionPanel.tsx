import {
  requestChanges,
  sendToHr,
  sendToVendor,
} from "@/controllers/candidate.controller";
import { suggestVendor } from "@/controllers/vendor.controller";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import AsyncSelect from "react-select/async";

export default function OpenSubmissionPanel({ submission, isOpen, onClose }) {
  const [stage, setStage] = useState("HR");
  const [comment, setComment] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  const handleSelect = (selectedOption: { label: string; value: string }) => {
    setSelectedVendor(selectedOption); // Update the selected vendor in state
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      switch (stage) {
        case "HR": {
          const response = await sendToHr(submission.id);

          console.log(response);
          break;
        }
        case "CANDIDATE": {
          const response = await requestChanges(submission.id, {
            comment: comment,
          });

          console.log(response);
          break;
        }
        case "VENDOR": {
          const response = await sendToVendor(
            [submission.id],
            selectedVendor.value
          );

          console.log(response);
          break;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Open Submission Again</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel>Stage</FormLabel>
              <Select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="HR">HR</option>
                <option value="CANDIDATE">Candidate</option>
                <option value="VENDOR">Vendor</option>
              </Select>
            </FormControl>

            {stage === "CANDIDATE" && (
              <FormControl isRequired>
                <FormLabel>Comments</FormLabel>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></Textarea>
              </FormControl>
            )}

            {stage === "VENDOR" && (
              <FormControl>
                <FormLabel>Location</FormLabel>
                {/* AsyncSelect for vendor selection */}
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  onChange={handleSelect}
                  value={selectedVendor} // Bind selected vendor value
                  placeholder="Search for vendors..."
                  defaultOptions={options} // Display options if available
                />
              </FormControl>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
