import { AdminType } from "@/schema/admin.schema";
import GenericTable, {
  actionsRenderer,
  GenericTableColumn,
} from "../common/GenericTable";
import { Tooltip, useDisclosure } from "@chakra-ui/react";
import { VendorType } from "@/schema/vendor.schema";
import { IoMdCreate, IoMdMail, IoMdTrash } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";
import CreateVendorModal from "./CreateVendorModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteVendor, sendInviteEmail } from "@/controllers/vendor.controller";

export interface ListVendorsTableProps {
  data: VendorType[];
  refresh: () => Promise<void>;
}

export default function ListVendorsTable(props: ListVendorsTableProps) {
  const { data, refresh } = props;
  const { user } = useAuth();

  const [selectedRow, setSelectedRow] = useState<VendorType | null>(null);
  const { onOpen, isOpen, onClose } = useDisclosure();

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
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Phone Number",
      field: "phoneNumber",
      formatter: (_, row) => {
        return row.phoneNumber ? row.phoneNumber : "-";
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      renderer: (row) => {
        const actions: any[] = [];

        if (user.role === "ADMIN") {
          actions.push(
            ...[
              {
                label: "Edit",
                icon: <IoMdCreate />,
                onClick: () => {
                  setSelectedRow(row);
                  onOpen();
                },
              },
              {
                label: "Sent Invite Mail",
                icon: <IoMdMail />,
                onClick: async (row) => {
                  try {
                    await sendInviteEmail(row.email);

                    await props.refresh();
                    toast.success("Invite email sent successfully.", {
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
              {
                label: "Delete",
                color: "red",
                icon: <IoMdTrash />,
                onClick: async (row) => {
                  try {
                    await deleteVendor(row.id);

                    await refresh();
                    toast.success("Invite email sent successfully.", {
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
        <CreateVendorModal
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
