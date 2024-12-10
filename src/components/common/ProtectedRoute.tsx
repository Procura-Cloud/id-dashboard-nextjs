import React from "react";
import { Box, Button, Text, HStack } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <HStack spacing={4} justify="center" py={4}>
      <Button
        onClick={handlePrevPage}
        isDisabled={currentPage === 1}
        colorScheme="teal"
      >
        Previous
      </Button>

      <Text>
        Page {currentPage} of {totalPages}
      </Text>

      <Button
        onClick={handleNextPage}
        isDisabled={currentPage === totalPages}
        colorScheme="teal"
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
