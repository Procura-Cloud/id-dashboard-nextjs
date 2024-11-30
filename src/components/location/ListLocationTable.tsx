import { AdminType } from "@/schema/admin.schema";
import GenericTable, {
  Action,
  actionsRenderer,
  GenericTableColumn,
} from "../common/GenericTable";
import { Tooltip, useDisclosure } from "@chakra-ui/react";
import { LocationType } from "@/schema/location.schema";
import { useAuth } from "@/context/AuthContext";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useState } from "react";
import CreateLocationModal from "./CreateLocationModal";
import { deleteLocation } from "@/controllers/location.controller";
import { toast } from "react-toastify";

export interface ListLocationTableProps {
  data: LocationType[];
  refresh: () => Promise<void>;
}

export default function ListLocationTable(props: ListLocationTableProps) {
  const { user } = useAuth();
  const { data, refresh } = props;

  const [selectedRow, setSelectedRow] = useState<LocationType | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns: GenericTableColumn[] = [
    {
      headerName: "ID",
      field: "id",
      renderer: (row) => {
        const value = row.id;
        return (
          <Tooltip label={value}>{`${value.slice(0, 3)}...${value.slice(
            -3
          )}`}</Tooltip>
        );
      },
    },
    {
      headerName: "Line One",
      field: "lineOne",
    },

    {
      headerName: "Line Two",
      field: "lineTwo",
      formatter: (_, row) => {
        return row.lineTwo ? row.lineTwo : "-";
      },
    },
    {
      headerName: "Line Three",
      field: "lineThree",
      formatter: (_, row) => {
        return row.lineThree ? row.lineThree : "-";
      },
    },
    {
      headerName: "Contact",
      field: "contact",
    },
    {
      headerName: "Actions",
      field: "actions",
      renderer: (row) => {
        const actions: Action[] = [];

        if (user.role === "ADMIN") {
          actions.push(
            ...[
              {
                label: "Edit",
                icon: <FiEdit />,
                onClick: (row) => {
                  setSelectedRow(row);
                  onOpen();
                },
              },
              {
                label: "Delete",
                color: "red",
                icon: <FiTrash />,
                onClick: async (row) => {
                  try {
                    await deleteLocation(row.id);

                    await refresh();
                    toast.success("Location deleted successfully.", {
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
        }

        return actionsRenderer(actions)(row);
      },
    },
  ];

  return (
    <>
      <GenericTable columns={columns} data={data} />

      {selectedRow && (
        <CreateLocationModal
          mode="edit"
          data={selectedRow}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refresh}
        />
      )}
    </>
  );
}
