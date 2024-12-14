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
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  downloadAndMarkDone,
  downloadCard,
  downloadCards,
  markCompleted,
  suggestVendor,
} from "@/controllers/vendor.controller";
import { useAuth } from "@/context/AuthContext";
import { IoMdCheckmark, IoMdDownload, IoMdEye } from "react-icons/io";
import { Action, actionsRenderer } from "@/components/common/GenericTable";
import ViewModal from "@/components/submission/ViewModal";
import SendToVendorModal from "@/components/admin/SendToVendorModal";
import MainLayout from "@/components/layouts/MainLayout";
import {
  getAllAssignedCandidates,
  rejectCandidate,
} from "@/controllers/candidate.controller";
import { IoIosSend } from "react-icons/io";
import withProtection from "@/components/common/ProtectedRoute";
import { MdOutlineClose } from "react-icons/md";
import PaginationComponent from "@/components/common/PaginationRow";
import usePagination from "@/hooks/Pagination";
import AsyncSelect from "react-select/async";

function AssignedPanel() {
  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const { user } = useAuth();

  const [selectedIdCard, setSelectedIdCard] = useState(null);

  const { currentPage, nextPage, prevPage, goToPage } = usePagination(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Function to load options asynchronously
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];

    try {
      const data = await suggestVendor({ params: { search: inputValue } });
      // Assuming data is an array of vendor objects like { name: "Vendor A", id: "1" }

      setOptions(data); // Set options in state
      return data;
    } catch (error) {
      console.error("Error fetching vendor options:", error);
      return [];
    }
  };

  // Handle when a vendor is selected
  const handleSelect = (selectedOption: { label: string; value: string }) => {
    setSelectedVendor(selectedOption); // Update the selected vendor in state
  };

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
    { accessorKey: "vendor.name", header: "Vendor" },
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
              label: "Send to another vendor",
              icon: <IoIosSend />,
              onClick: () => {
                if (
                  confirm(
                    "Are you sure that you want to send this submission to another vendor?"
                  )
                ) {
                  setSelectedRowIds({
                    [row.id]: true,
                  });
                  onSendToVendorOpen();
                }
              },
            },
            {
              label: "Reject Submission",
              icon: <MdOutlineClose />,
              onClick: async () => {
                if (
                  confirm(
                    "Are you sure that you want to reject this submission? "
                  )
                ) {
                  try {
                    await rejectCandidate(row.original.id);
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
                }
              },
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
      const data = await getAllAssignedCandidates({
        page: currentPage,
        ...(selectedVendor && { vendorId: selectedVendor.value }),
      });

      setAssignedSubmissions(data.results);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    fecthApprovedSubmissions();
  }, [currentPage, selectedVendor]);

  return (
    <MainLayout
      title="Assigned"
      content="View assigned submissions."
      path={["Dashboard", "Submissions", "Assigned"]}
    >
      <Box mt="2rem">
        <Box width={{ sm: "100%", md: "50%" }} mb="4">
          <AsyncSelect
            cacheOptions
            isClearable
            loadOptions={loadOptions}
            onChange={handleSelect}
            value={selectedVendor} // Bind selected vendor value
            placeholder="Search for vendors..."
            defaultOptions={options} // Display options if available
          />
        </Box>
        <PaginationComponent
          total={total}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
        <Table marginTop="1rem">
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

        <SendToVendorModal
          mode="create"
          applications={selectedRows.map((row) => row.id)}
          isOpen={isSendToVendorOpen}
          onClose={onSendToVendorClose}
          refresh={fecthApprovedSubmissions}
        />

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

export default withProtection(AssignedPanel);
