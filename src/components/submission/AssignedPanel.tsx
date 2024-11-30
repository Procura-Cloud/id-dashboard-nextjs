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
  HStack,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import ViewModal from "./ViewModal";
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "@/template/IDCard";
import SendToVendorModal from "../admin/SendToVendorModal";
import {
  downloadAndMarkDone,
  downloadCard,
  downloadCards,
  getAssignedCandidates,
  markCompleted,
} from "@/controllers/vendor.controller";
import { useAuth } from "@/context/AuthContext";
import { IoMdCheckmark, IoMdDownload } from "react-icons/io";
import { Action, actionsRenderer } from "../common/GenericTable";

export default function AssignedPanel() {
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const { user } = useAuth();

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isSendToVendorOpen,
    onOpen: onSendToVendorOpen,
    onClose: onSendToVendorClose,
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
    { accessorKey: "status", header: "Status" },
    {
      id: "actions", // Custom column for actions
      header: "Actions",
      cell: ({ row }) => {
        const actions: Action[] = [];

        actions.push(
          ...[
            {
              label: "Download",
              icon: <IoMdDownload />,
              onClick: () => downloadCard(row.original.id),
            },
            {
              label: "Mark as Completed",
              icon: <IoMdCheckmark />,
              onClick: async () => {
                try {
                  await markCompleted(row.original.id);
                  await fecthApprovedSubmissions();
                  toast.success("Candidate marked as completed.", {
                    position: "bottom-center",
                  });
                } catch (error) {
                  console.error(error);
                  toast.error("Something went wrong.", {
                    position: "bottom-center",
                  });
                }
              },
            },
          ]
        );

        return actionsRenderer(actions)(row);
      },
    },
  ];

  const handleSendToVendor = async () => {
    console.log("Selected:", selectedRows);
  };

  const table = useReactTable({
    data: assignedSubmissions,
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
    (rowId) => assignedSubmissions[rowId]
  );

  const selectedRowCount = Object.keys(selectedRowIds).filter(
    (rowId) => selectedRowIds[rowId]
  ).length;

  const fecthApprovedSubmissions = async () => {
    try {
      const data = await getAssignedCandidates(user.id);
      setAssignedSubmissions(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fecthApprovedSubmissions();
  }, []);

  return (
    <Box>
      <Table>
        <Thead bg="gray.100" borderBottom="solid 1px" borderColor="gray.500">
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectedRowCount === table.getRowModel().rows.length}
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
      <HStack>
        <Button
          mt={4}
          colorScheme="blue"
          isDisabled={selectedRowCount === 0}
          onClick={async () => {
            try {
              await downloadAndMarkDone(selectedRows.map((row) => row.id));
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong.", {
                position: "bottom-center",
              });
            }
          }}
        >
          Download and Mark as Done
        </Button>
        <Button
          mt={4}
          colorScheme="blue"
          isDisabled={selectedRowCount === 0}
          onClick={async () => {
            try {
              await downloadCards(selectedRows.map((row) => row.id));
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong.", {
                position: "bottom-center",
              });
            }
          }}
        >
          Download Submissions
        </Button>
      </HStack>

      {selectedIdCard && (
        <ViewModal data={selectedIdCard} isOpen={isOpen} onClose={onClose} />
      )}

      {selectedRowCount > 0 && (
        <SendToVendorModal
          mode="create"
          applications={selectedRows.map((row) => row.id)}
          isOpen={isSendToVendorOpen}
          onClose={onSendToVendorClose}
          refresh={fecthApprovedSubmissions}
        />
      )}
    </Box>
  );
}
