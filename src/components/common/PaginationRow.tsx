import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function PaginationRow({
  instance,
  type,
}: {
  instance: any;
  type?: string;
}) {
  const { page, totalPages, hasNext, setPage, hasData, limit, totalCount } =
    instance;
  const [editingPage, setEditingPage] = useState<any>(page || 1);

  const handleNext = () => {
    if (!hasNext) return;
    setPage(+page + 1);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  useEffect(() => {
    setEditingPage(page);
  }, [page]);

  if (!hasData) return null;

  const firstItem = Math.min((page - 1) * limit + 1, totalCount);
  const lastItem = Math.min(page * limit, totalCount);

  if (type === "small") {
    return (
      <HStack>
        <Text fontSize="xs" color="gray.500">
          Showing {firstItem}-{lastItem} out of {totalCount} results
        </Text>
        <HStack ml="auto">
          <IconButton
            aria-label="Previous Page"
            size="sm"
            onClick={handlePrev}
            isDisabled={page == 1}
            icon={<FiChevronLeft />}
            fontSize="xl"
            color="procura-blue"
            variant="ghost"
            colorScheme="gray"
          />

          <IconButton
            aria-label="Next Page"
            size="sm"
            onClick={handleNext}
            isDisabled={!hasNext}
            icon={<FiChevronRight />}
            fontSize="xl"
            color="procura-blue"
            variant="ghost"
            colorScheme="gray"
          />
        </HStack>
      </HStack>
    );
  } else {
    return (
      <HStack>
        <Text fontSize="sm" color="gray.500">
          Showing {firstItem}-{lastItem} out of {totalCount} results
        </Text>
        <HStack ml="auto">
          <Text fontSize="sm" color="gray.500">
            Page
          </Text>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newPage = editingPage;
              if (isNaN(newPage) || newPage < 1 || newPage > totalPages) {
                setEditingPage(page);
                return;
              }
              setPage(newPage);
            }}
          >
            <Input
              size="sm"
              w="16"
              textAlign="center"
              value={editingPage}
              onChange={(e) => setEditingPage(e.target.value)}
              type="number"
              fontSize="sm"
            />
          </form>

          <Text fontSize="sm" color="gray.500">
            out of {totalPages}
          </Text>

          <IconButton
            aria-label="Previous Page"
            size="md"
            onClick={handlePrev}
            isDisabled={page == 1}
            icon={<FiChevronLeft />}
            fontSize="xl"
            color="procura-blue"
            variant="ghost"
            colorScheme="gray"
          />

          <IconButton
            aria-label="Next Page"
            size="md"
            onClick={handleNext}
            isDisabled={!hasNext}
            icon={<FiChevronRight />}
            fontSize="xl"
            color="procura-blue"
            variant="ghost"
            colorScheme="gray"
          />
        </HStack>
      </HStack>
    );
  }
}
