import {
  Text,
  Grid,
  GridItem,
  Box,
  Stack,
  Button,
  IconButton,
  Select,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function Hero({
  onChange,
  onPageChange,
  onPrevPage,
  onNextPage,
  currPage,
  product,
}) {
  return (
    <Box w="50%" maxW="1200px" my="0" mx="auto">
      <Text
        fontSize="5xl"
        fontWeight={700}
        position="relative"
        display="inline-block"
        mt={12}
        _after={{
          content: "''",
          width: "full",
          height: "30%",
          position: "absolute",
          bottom: 1,
          left: 0,
          bg: "pink.400",
          zIndex: -1,
        }}
      >
        Our Products
      </Text>
      <Stack direction="row" mt={4}>
        <Select placeholder="Name" name="sort" onChange={onChange}>
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </Select>
        <Select placeholder="Price" name="price" onChange={onChange}>
          <option value="asc">Low - High</option>
          <option value="desc">High - Low</option>
        </Select>
      </Stack>
      <Grid
        mt={4}
        templateColumns="repeat(auto-fit, 300px)"
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
      >
        {product.products.map((product, idx) => (
          <GridItem key={product.id}>
            <ProductCard product={product} idx={idx} />
          </GridItem>
        ))}
      </Grid>
      {/* TODO: what if there are 100 pages? Make the pagination only shows 10 max at once  */}
      <Stack direction="row" spacing={2} my={8} align="center" justify="center">
        <IconButton
          aria-label="previous page button"
          w={8}
          h={8}
          icon={<ChevronLeftIcon />}
          isDisabled={currPage === 1}
          onClick={onPrevPage}
        />
        {Array(product.totalPages)
          .fill(0)
          .map((_, i) => (
            <Button
              w={8}
              h={8}
              colorScheme="pink"
              variant={currPage === i + 1 ? "solid" : "ghost"}
              key={i}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        <IconButton
          aria-label="next page button"
          w={8}
          h={8}
          isDisabled={currPage === product.totalPages}
          icon={<ChevronRightIcon />}
          onClick={onNextPage}
        />
      </Stack>
    </Box>
  );
}

export default Hero;
