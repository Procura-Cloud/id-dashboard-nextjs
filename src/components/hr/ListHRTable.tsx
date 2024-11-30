import { AdminType } from "@/schema/admin.schema";
import GenericTable, {
  Action,
  actionsRenderer,
  GenericTableColumn,
} from "../common/GenericTable";
import { Tooltip } from "@chakra-ui/react";
import { IoMdMailUnread, IoMdTrash } from "react-icons/io";
import { toast } from "react-toastify";
import { deleteHR, sendInviteEmail } from "@/controllers/hr.controller";
import { useAuth } from "@/context/AuthContext";

export interface ListHRTableProps {
  data: AdminType[];
  refresh: () => Promise<void>;
}

export default function ListHRTable(props: ListHRTableProps) {
  const { data } = props;
  const { user } = useAuth();

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
      headerName: "Actions",
      field: "actions",
      renderer: (row) => {
        const actions: Action[] = [];

        if (user.role === "ADMIN") {
          actions.push(
            ...[
              {
                label: "Send Invite Email",
                icon: <IoMdMailUnread />,
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
                label: "Delete Admin",
                color: "red",
                icon: <IoMdTrash />,
                onClick: async () => {
                  try {
                    await deleteHR(row.id);

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
            ]
          );
        }

        return actionsRenderer(actions)(row);
      },
    },
  ];

  return <GenericTable columns={columns} data={data} />;
}
