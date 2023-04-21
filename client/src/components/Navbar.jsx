import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

function Navbar({ page = "" }) {
  return (
    <Box>
      <Flex
        bg="white"
        color="gray.600"
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
        gap={2}
      >
        <IconButton
          as={Link}
          to="/"
          icon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="pink"
          aria-label="Back button"
        />
        <Text>{page}</Text>
      </Flex>
    </Box>
  );
}

export default Navbar;
