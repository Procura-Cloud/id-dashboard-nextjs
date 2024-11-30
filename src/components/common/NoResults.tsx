import { Box, Text, Icon } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function NoResults({
  message = "No results found",
  iconSize = 50,
}) {
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={FiSearch} boxSize={iconSize} color="gray.400" mb={4} />
      <Text fontSize="lg" color="gray.600">
        {message}
      </Text>
    </Box>
  );
}
