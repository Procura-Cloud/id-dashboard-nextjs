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
import { useForm } from "react-hook-form";
import { PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "@/template/IDCard";

export interface ViewModalProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewModal({ data, isOpen, onClose }: ViewModalProps) {
  console.log("Data", data);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ height: "min(80vh, 800px)", padding: 0 }}>
        <ModalHeader>Create Admin</ModalHeader>
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
