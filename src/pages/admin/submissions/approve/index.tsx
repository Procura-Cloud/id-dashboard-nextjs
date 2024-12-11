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
} from "@chakra-ui/react";
import { getApprovedCandidates } from "@/controllers/candidate.controller";
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

export default function AdminArrpovalPage() {
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { user, loading } = useAuth();

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
            <MenuItem>Delete</MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedIdCard({
                  ...row.original,
                  location: {
                    label: row.original.location.slug,
                    value: row.original.location.id,
                  },
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
      setApprovedSubmissions(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!user && !loading) {
      router.push("/login");
    }
  }, []);

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

  if (loading || !user) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Box marginTop="2rem">
        <HStack justifyContent="space-between" alignItems="center">
          <Breadcrumb
            size="sm"
            fontSize="sm"
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Submissions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Approve</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Avatar name={user.name} />
        </HStack>
        <Table mt="4rem">
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
          <Tbody fontSize="small">
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
    </MainLayout>
  );
}
