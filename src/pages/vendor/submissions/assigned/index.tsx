import React, { use, useEffect, useState } from "react";
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
  Heading,
  Text,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "@/template/IDCard";
import {
  downloadAndMarkDone,
  downloadCard,
  downloadCards,
  getAssignedCandidates,
  markCompleted,
} from "@/controllers/vendor.controller";
import { useAuth } from "@/context/AuthContext";
import { IoMdCheckmark, IoMdDownload, IoMdEye } from "react-icons/io";
import { Action, actionsRenderer } from "@/components/common/GenericTable";
import ViewModal from "@/components/submission/ViewModal";
import SendToVendorModal from "@/components/admin/SendToVendorModal";
import MainLayout from "@/components/layouts/MainLayout";
import { getAllAssignedCandidates } from "@/controllers/candidate.controller";
import { IoIosSend } from "react-icons/io";
import { useRouter } from "next/router";
import AsyncSelect from "react-select/async";
import withProtection from "@/components/common/ProtectedRoute";
import { suggestLocations } from "@/controllers/location.controller";

function VendorAssignedPage() {
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedLocation, setLocation] = useState(null);
  const [defaultLocations, setDefaultLocations] = useState([]);

  const {
    isOpen: isSendToVendorOpen,
    onOpen: onSendToVendorOpen,
    onClose: onSendToVendorClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
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
    { accessorKey: "location.slug", header: "Location" },
    {
      id: "actions", // Custom column for actions
      header: "Actions",
      cell: ({ row }) => {
        const actions: Action[] = [];

        actions.push(
          ...[
            {
              label: "View",
              icon: <IoMdEye />,
              onClick: () => {
                console.log(row.original);
                setSelectedIdCard(row.original);
                onViewOpen();
              },
            },
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

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const data = await suggestLocations({
        params: {
          search: inputValue,
        },
      });

      return data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

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

  const selectedRows =
    Object.keys(selectedRowIds || {}).map(
      (rowId) => assignedSubmissions?.[rowId]
    ) ?? [];

  const selectedRowCount =
    Object.keys(selectedRowIds).filter((rowId) => selectedRowIds[rowId])
      .length ?? 0;

  const fecthApprovedSubmissions = async () => {
    try {
      const data = await getAssignedCandidates({
        locationID: selectedLocation?.value,
      });
      setAssignedSubmissions(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    suggestLocations().then((response) => {
      setDefaultLocations(response);
    });
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

  useEffect(() => {
    fecthApprovedSubmissions();
  }, [selectedLocation]);

  return (
    <MainLayout
      title="Assigned"
      content="View assinged submissions."
      path={["Vendor", "Submissions", "Assigned"]}
    >
      <Box>
        <HStack justifyContent={"flex-end"}>
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
        <HStack mt="2">
          <AsyncSelect
            styles={{ container: (base) => ({ ...base, width: "100%" }) }}
            isClearable
            defaultOptions={defaultLocations}
            cacheOptions
            loadOptions={loadOptions}
            onChange={(e) => setLocation(e)}
            placeholder="Search items..."
          />
        </HStack>

        <Table marginTop="4rem">
          <Thead bg="gray.100" borderBottom="solid 1px" borderColor="gray.500">
            <Tr>
              <Th>
                <Checkbox
                  isChecked={
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
          <Tbody fontSize="medium">
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

        {selectedRows.length > 0 && (
          <SendToVendorModal
            mode="create"
            applications={selectedRows
              .filter((row) => row) // Remove undefined rows
              .map((row) => row.id)}
            isOpen={isSendToVendorOpen}
            onClose={onSendToVendorClose}
            refresh={fecthApprovedSubmissions}
          />
        )}

        {selectedIdCard && (
          <ViewModal
            data={selectedIdCard}
            isOpen={isViewOpen}
            onClose={onViewClose}
          />
        )}
      </Box>
    </MainLayout>
  );
}

export default withProtection(VendorAssignedPage, {
  permissions: ["VENDOR"],
  redirectTo: "/login",
});
