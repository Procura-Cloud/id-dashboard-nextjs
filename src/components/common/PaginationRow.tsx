import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, IconButton, Text } from "@chakra-ui/react";

export interface PaginationProps {
  total: number;
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
}

export default function PaginationComponent(props: PaginationProps) {
  const { total, currentPage, nextPage, prevPage } = props;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb="2"
    >
      <Text>
        Showing {currentPage} of {total} submissions
      </Text>
      <Box>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous Page"
          onClick={prevPage}
          mr={2}
        />
        <ButtonGroup>
          <Button isActive>{currentPage}</Button>
        </ButtonGroup>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next Page"
          onClick={nextPage}
          ml={2}
        />
      </Box>
    </Box>
  );
}
