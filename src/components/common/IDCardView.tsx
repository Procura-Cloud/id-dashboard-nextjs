import { CandidateType } from "@/schema/candidate.schema";
import { Box, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export interface IDCardViewProps {
  data: CandidateType;
}
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
  Image,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { hrSchema, HRType } from "@/schema/hr.schema";
import { createHR } from "@/controllers/hr.controller";
import { locationSchema, LocationType } from "@/schema/location.schema";
import { createLocation } from "@/controllers/location.controller";
import { submitForm } from "@/controllers/candidate.controller";
import { useRouter } from "next/router";
import ViewModal from "../submission/ViewModal";

export interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (croppedImage: File) => void; // The cropped image is a Base64 string
}

export function ImagePickerModal({
  isOpen,
  onClose,
  onImageUpload,
}: ImagePickerModalProps) {
  const [image, setImage] = useState(null); // To store the uploaded image
  const [croppedImage, setCroppedImage] = useState(null); // To store the cropped result
  const cropperRef = useRef(null); // Ref for the Cropper instance

  // Handle file input change
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle cropping
  const onCrop = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas().toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.png", {
            type: "image/png",
          });
          onImageUpload(file); // Pass the file to the parent component
          setCroppedImage(URL.createObjectURL(blob)); // For preview (optional)
          onClose(); // Close the modal
        }
      },
      "image/png",
      1 // Quality parameter (1 = 100% quality for PNG)
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (croppedImage) {
      onImageUpload(croppedImage); // Pass the cropped image to the parent
      onClose(); // Close the modal
    }
  };

  const onClear = (e) => {
    e.preventDefault();
    setImage(null); // Clear the image
    setCroppedImage(null); // Clear the cropped image
    onImageUpload(null); // Pass the cropped image to the parent
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Upload and Crop Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!image ? (
              <Input type="file" accept="image/*" onChange={onFileChange} />
            ) : (
              <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                ref={cropperRef}
                viewMode={1}
                aspectRatio={175 / 240} // For square crop, set aspect ratio to 1
                guides={true}
              />
            )}
          </ModalBody>

          <ModalFooter>
            {image && (
              <Button onClick={onCrop} colorScheme="blue" mr={3}>
                Crop
              </Button>
            )}
            <Button type="submit" colorScheme="red" onClick={onClear}>
              Clear
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default function IDCardView({
  data,
  token,
}: {
  data: CandidateType;
  token: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Convert remote URL to File
  const convertToFile = async (photoUrl: string): Promise<File | null> => {
    if (!photoUrl) return null;

    // If it's a URL, fetch the image and convert to a File
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob(); // Get the image as a Blob
      return new File([blob], "photo.png", { type: blob.type });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  // Initialize image state
  useEffect(() => {
    const fetchImage = async () => {
      const initialImage = await convertToFile(data.photoUrl);
      setImage(initialImage);
    };
    fetchImage();
  }, [data.photoUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!image) {
      return toast.error("Please upload an image first.", {
        position: "bottom-center",
      });
    }

    try {
      const response = await submitForm(data.id, {
        token: token,
        photo: image,
      });

      toast.success("ID Application submitted successfully.", {
        position: "bottom-center",
      });

      router.push("/candidate/success?id=" + data.id);
    } catch (error) {
      toast.error(error?.message ?? "Something went wrong.", {
        position: "bottom-center",
      });
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <Box sx={{ padding: "1rem", display: "flex", flexDirection: "column" }}>
      <Box sx={{ marginTop: "1rem" }}>
        <Box
          onClick={onOpen}
          sx={{
            justifySelf: "center",
            width: "175px",
            height: "240px",
            backgroundColor: "gray.300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {!image ? (
            <FaCamera />
          ) : (
            <Image
              src={URL.createObjectURL(image)} // Create a temporary URL for the file
              alt="ID Card"
              width="100%"
              height="100%"
            />
          )}
        </Box>
        <VStack spacing={6}>
          <FormControl isReadOnly>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" value={data.name} />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Location</FormLabel>
            <Input placeholder="Location" value={data.location?.slug ?? "-"} />
          </FormControl>

          <VStack width="100%">
            <Button
              colorScheme="blue"
              sx={{ width: "100%" }}
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </VStack>
        </VStack>
      </Box>

      <ImagePickerModal
        onImageUpload={(data: File) => setImage(data)}
        isOpen={isOpen}
        onClose={onClose}
      />

      <ViewModal data={data} isOpen={isViewOpen} onClose={onViewClose} />
    </Box>
  );
}
