import {
  CandidateType,
  newApplicationSchema,
  NewApplicationType,
} from "@/schema/candidate.schema";
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
import { ImagePickerModal } from "../common/IDCardView";

export interface NewApplicationFormProps {
  data: CandidateType;
  token: string;
}

export default function NewApplicationForm(props: NewApplicationFormProps) {
  const { data, token } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [image, setImage] = useState<File | null>(null);

  const {
    watch,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(newApplicationSchema),
    mode: "onChange",
  });

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

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

  const onSubmit = async (data: NewApplicationType) => {
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
  };

  useEffect(() => {
    reset({
      id: data.id,
      name: data.name,
      location: data.location.slug,
    });
  }, [data]);

  return (
    <Box
      sx={{ padding: "1rem", display: "flex", flexDirection: "column" }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
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
            <Input placeholder="Name" {...register("name")} />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Location</FormLabel>
            <Input placeholder="Location" {...register("location")} />
          </FormControl>

          <VStack width="100%">
            <Button
              colorScheme="blue"
              sx={{ width: "100%" }}
              type="submit"
              isDisabled={!isValid || isSubmitting || !image}
              isLoading={isSubmitting}
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
