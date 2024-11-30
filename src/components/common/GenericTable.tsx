import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Link as ChakraLink,
  Badge,
  Box,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMoreVertical } from "react-icons/fi";

export default function GenericTable({
  data,
  columns,
  removePadding = false,
  ...props
}: GenericTableProps) {
  const renderCell = (row: any, column: GenericTableColumn) => {
    if (column.renderer) {
      return column.renderer(row, column);
    }

    if (column.formatter) {
      return column.formatter(row[column.field], row);
    }

    return row[column.field];
  };

  return (
    <TableContainer border="solid 1px" borderColor="gray.200" rounded="md">
      <Table size="md" {...props}>
        <Thead bg="gray.100" borderBottom="solid 1px" borderColor="gray.500">
          <Tr position={"sticky"}>
            {columns.map((column, index) => (
              <Th key={index}>{column.headerName}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr fontSize="sm" key={index} bg={row.bgColor}>
              {columns.map((column, index) => (
                <Td py={removePadding ? 0 : 2} key={index}>
                  <Box px={column.px}>{renderCell(row, column)}</Box>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export interface GenericTableProps {
  data: any[];
  columns: GenericTableColumn[];
  removePadding?: boolean;
  [key: string]: any;
}

export interface GenericTableColumn {
  headerName: string;
  field?: string;
  renderer?: (row: any, column: GenericTableColumn) => any;
  formatter?: (value: any, row: any) => string;
  px?: number;
}

export function actionsRenderer(actions: Action[]) {
  const renderer = (row) => {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreVertical />}
          variant="ghost"
          aria-label="Actions"
          colorScheme="gray"
        />
        <MenuList>
          {actions.map((action, index) => (
            <Box>
              {action.hide && action.hide(row) ? (
                <></>
              ) : (
                <MenuItem
                  icon={action.icon}
                  key={index}
                  textColor={action.color || "gray.600"}
                  fontSize="sm"
                  onClick={() => action.onClick(row)}
                  fontWeight="medium"
                >
                  {action.label}
                </MenuItem>
              )}
            </Box>
          ))}
        </MenuList>
      </Menu>
    );
  };

  return renderer;
}

export interface Action {
  label: string;
  icon?: React.ReactElement;
  onClick: (row: any) => void;
  color?: string;
  hide?: (row: any) => boolean;
}

export function linkRenderer({
  createLink,
  createLabel = null,
  color = "blue.500",
  onClick = null,
  hideLink = null,
}: LinkRendererOptions) {
  const getFormattedText = (row, column) => {
    if (createLabel) {
      return createLabel(row);
    }

    if (column.formatter) {
      return column.formatter(row[column.field], row);
    }

    return row[column.field];
  };

  const renderer = (row, column) => (
    <Box>
      {hideLink && hideLink(row) ? (
        <Text>{createLink(row)}</Text>
      ) : (
        <ChakraLink
          as={Link}
          textColor={color}
          href={createLink ? createLink(row) : "#"}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick(row);
            }
          }}
        >
          {getFormattedText(row, column)}
        </ChakraLink>
      )}
    </Box>
  );

  return renderer;
}

export interface LinkRendererOptions {
  createLink: (row: any) => string;
  createLabel?: (row: any) => string;
  color?: string;
  onClick?: (row: any) => void;
  hideLink?: (row: any) => boolean;
}

export function badgeRenderer({
  createLabel = null,
  defaultColor = "green",
  disableDefaultColors = false,
  colorMap = null,
}) {
  const getBadgeColor = (row, column) => {
    const status = createLabel
      ? createLabel(row).toLowerCase()
      : row[column.field]?.toLowerCase && row[column.field]?.toLowerCase();

    if (colorMap) {
      return colorMap[status] || defaultColor;
    }

    if (!disableDefaultColors) {
      if (
        [
          "approved",
          "success",
          "active",
          "complete",
          "completed",
          "accepted",
        ].includes(status)
      ) {
        return "green";
      }

      if (["rejected", "cancelled"].includes(status)) {
        return "red";
      }

      if (["pending"].includes(status)) {
        return "yellow";
      }
    }

    return defaultColor;
  };

  const renderer = (row, column) => (
    <Badge
      px="2"
      py="1"
      size="sm"
      rounded="md"
      colorScheme={getBadgeColor(row, column)}
      variant="subtle"
    >
      {createLabel ? createLabel(row) : row[column.field]}
    </Badge>
  );

  return renderer;
}

export interface BadgeRendererOptions {
  createLabel?: (row: any) => string;
  defaultColor?: string;
  disableDefaultColors?: boolean;
  colorMap?: { [key: string]: string };
}
