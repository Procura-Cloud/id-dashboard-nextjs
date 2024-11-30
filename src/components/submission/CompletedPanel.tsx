import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
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
import {
  getApprovedCandidates,
  getCompletedSubmissions,
} from "@/controllers/candidate.controller";
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
} from "@/controllers/vendor.controller";
import { useAuth } from "@/context/AuthContext";
import { Action, actionsRenderer } from "../common/GenericTable";
import { IoMdDownload } from "react-icons/io";

export default function CompletedPanel() {
  const [completedSubmissions, setCompletedSubmissions] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const { user } = useAuth();

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isSendToVendorOpen,
    onOpen: onSendToVendorOpen,
    onClose: onSendToVendorClose,
  } = useDisclosure();

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "employeeID",
      header: "Employee Code",
    },
    {
      accessorKey: "location",
      header: "Location",
      accessorFn: (row) =>
        `${row.location.lineOne}, ${row.location.lineTwo}, ${row.location.contact}`,
    },
    {
      accessorKey: "vendor.name",
      header: "Vendor",
    },
    {
      id: "actions", // Custom column for actions
      header: "Actions",
      cell: ({ row }) => {
        const actions: Action[] = [];

        if (user.role === "ADMIN") {
          actions.push(
            ...[
              {
                label: "Download",
                icon: <IoMdDownload />,
                onClick: () => downloadCard(row.original.id),
              },
            ]
          );
        }

        return actionsRenderer(actions)(row);
      },
    },
  ];

  const handleSendToVendor = async () => {
    console.log("Selected:", selectedRows);
  };

  const table = useReactTable({
    data: completedSubmissions,
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
    (rowId) => completedSubmissions[rowId]
  );

  const selectedRowCount = Object.keys(selectedRowIds).filter(
    (rowId) => selectedRowIds[rowId]
  ).length;

  const fecthApprovedSubmissions = async () => {
    try {
      const data = await getCompletedSubmissions();
      setCompletedSubmissions(data);
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
    <Box overflowX="auto">
      <Table sx={{ fontSize: "sm" }}>
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
