import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (croppedImage: File) => void; // The cropped image is a Base64 string
}

export default function ImagePickerModal({
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
