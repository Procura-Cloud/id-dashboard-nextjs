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
  Spinner,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import {
  getApprovedCandidates,
  rejectCandidate,
} from "@/controllers/candidate.controller";
import { toast } from "react-toastify";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "@/template/IDCard";
import { useAuth } from "@/context/AuthContext";
import ViewModal from "@/components/submission/ViewModal";
import SendToVendorModal from "@/components/admin/SendToVendorModal";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import { CandidateType } from "@/schema/candidate.schema";
import AddCandidateModal from "@/components/hr/AddCandidateModal";
import withProtection from "@/components/common/ProtectedRoute";

export function AdminArrpovalPage() {
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState({});

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { user, isLoading } = useAuth();

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

  const columns: ColumnDef<CandidateType>[] = [
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
    { accessorKey: "location.slug", header: "Location" },
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
              onClick={() => {
                setSelectedIdCard(row.original);
                onOpen();
              }}
            >
              View
            </MenuItem>

            <MenuItem
              onClick={async () => {
                setSelectedIdCard(row.original);

                try {
                  rejectCandidate(row.original.id);
                  toast.success("Submission rejected.", {
                    position: "bottom-center",
                  });
                  await fecthApprovedSubmissions();
                } catch (error) {
                  console.error(error);
                  toast.error("Something went wrong.", {
                    position: "bottom-center",
                  });
                }
              }}
            >
              Reject Submission
            </MenuItem>

            <MenuItem
              onClick={() => {
                setSelectedIdCard({
                  ...row.original,
                  ...(row.original.location && {
                    location: {
                      label: row.original.location.slug,
                      value: row.original.location.id,
                    },
                  }),
                });
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
      setApprovedSubmissions(data.results);
      setTotal(data.count);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
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
    <MainLayout
      title="Approved Submissions"
      content="Approve or reject submissions here."
      path={["Dashboard", "Submissions", "Approved"]}
    >
      <Box marginTop="2rem">
        <Flex justifyContent="flex-end" marginTop="16">
          <Button
            colorScheme="blue"
            isDisabled={selectedRowCount === 0}
            onClick={onSendToVendorOpen}
          >
            Send to Vendor
          </Button>
        </Flex>

        <Table mt="2rem">
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
    </MainLayout>
  );
}

export default withProtection(AdminArrpovalPage);
