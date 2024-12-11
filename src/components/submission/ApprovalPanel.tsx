import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
  Button,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { getApprovedCandidates } from "@/controllers/candidate.controller";
import { toast } from "react-toastify";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import ViewModal from "./ViewModal";
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "@/template/IDCard";
import SendToVendorModal from "../admin/SendToVendorModal";
import { useAuth } from "@/context/AuthContext";
import AddCandidateModal from "../hr/AddCandidateModal";

const data = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
];

export default function ApprovalPanel() {
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const {
    isOpen: isSendToVendorOpen,
    onOpen: onSendToVendorOpen,
    onClose: onSendToVendorClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    { accessorKey: "employeeID", header: "Employee Code" },
    {
      id: "actions", // Custom column for actions
      header: "Actions",
      cell: ({ row }) => (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<ChevronDownIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem
              as={Button}
              leftIcon={<FaEye />}
              onClick={() => {
                setSelectedIdCard(row.original);
                onOpen();
              }}
            >
              View
            </MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedIdCard(row.original);
                onEditOpen();
              }}
            >
              Edit
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  const handleSendToVendor = async () => {
    console.log("Selected:", selectedRows);
  };

  const table = useReactTable({
    data: approvedSubmissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleRowSelection = (rowId) => {
    setSelectedRowIds((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = table
      .getRowModel()
      .rows.every((row) => selectedRowIds[row.id]);

    const newSelection = {};
    if (!allSelected) {
      table.getRowModel().rows.forEach((row) => {
        newSelection[row.id] = true;
      });
    }
    setSelectedRowIds(newSelection);
  };

  const selectedRows = Object.keys(selectedRowIds).map(
    (rowId) => approvedSubmissions[rowId]
  );

  const selectedRowCount = Object.keys(selectedRowIds).filter(
    (rowId) => selectedRowIds[rowId]
  ).length;

  const fecthApprovedSubmissions = async () => {
    try {
      const data = await getApprovedCandidates();
      setApprovedSubmissions(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    if (user.role !== "ADMIN") return;

    fecthApprovedSubmissions();

    // Set interval to fetch every 5 seconds
    const intervalId = setInterval(() => {
      fecthApprovedSubmissions();
    }, 10000);

    // Clear interval on component unmount or when deferredSearch changes
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box>
      <Table>
        <Thead bg="gray.100" borderBottom="solid 1px" borderColor="gray.500">
          <Tr>
            <Th>
              <Checkbox
                isChecked={
                  selectedRowCount !== 0 &&
                  selectedRowCount === table.getRowModel().rows.length
                }
                isIndeterminate={
                  selectedRowCount > 0 &&
                  selectedRowCount < table.getRowModel().rows.length
                }
                onChange={toggleSelectAll}
              />
            </Th>
            {table
              .getHeaderGroups()
              .map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))
              )}
          </Tr>
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <Checkbox
                  isChecked={!!selectedRowIds[row.id]}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </Td>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button
        mt={4}
        colorScheme="blue"
        isDisabled={selectedRowCount === 0}
        onClick={onSendToVendorOpen}
      >
        Send to Vendor
      </Button>

      {selectedIdCard && (
        <ViewModal data={selectedIdCard} isOpen={isOpen} onClose={onClose} />
      )}

      {selectedRowCount > 0 && (
        <SendToVendorModal
          mode="create"
          applications={selectedRows.map((row) => row.id)}
          isOpen={isSendToVendorOpen}
          onClose={() => {
            setSelectedRowIds({});
            onSendToVendorClose();
          }}
          refresh={fecthApprovedSubmissions}
        />
      )}

      {selectedIdCard && (
        <AddCandidateModal
          mode="edit"
          data={selectedIdCard}
          refresh={fecthApprovedSubmissions}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </Box>
  );
}
