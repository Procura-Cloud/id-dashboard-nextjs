import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export interface ViewModalProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewModal({ data, isOpen, onClose }: ViewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ height: "min(80vh, 800px)", padding: 0 }}>
        <ModalHeader>View ID Card</ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{ padding: 0 }}>
          <embed
            type="application/pdf"
            width="100%"
            height="100%"
            src={`${process.env.NEXT_PUBLIC_API_URL}candidate/view/${data.id}`}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
