import { Stack, Button, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function Pagination({ data = {}, currPage, setCurrPage }) {
  const handlePageChange = (page) => setCurrPage(page);

  const handlePrevPage = () =>
    setCurrPage((p) => {
      if (p > 1) return p - 1;
      return p;
    });

  const handleNextPage = () =>
    setCurrPage((p) => {
      if (p < data.totalPages) return p + 1;
      return p;
    });

  return (
    <Stack direction="row" spacing={2} my={8} align="center" justify="center">
      <IconButton
        aria-label="previous page button"
        w={8}
        h={8}
        icon={<ChevronLeftIcon />}
        isDisabled={currPage === 1}
        onClick={handlePrevPage}
      />
      {/* TODO: what if there are 100 pages? Make the pagination only shows 10 max at once  */}
      {Array(data.totalPages)
        .fill(0)
        .map((_, i) => (
          <Button
            w={8}
            h={8}
            colorScheme="pink"
            variant={currPage === i + 1 ? "solid" : "ghost"}
            key={i}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      <IconButton
        aria-label="next page button"
        w={8}
        h={8}
        isDisabled={currPage === data.totalPages}
        icon={<ChevronRightIcon />}
        onClick={handleNextPage}
      />
    </Stack>
  );
}

export default Pagination;
