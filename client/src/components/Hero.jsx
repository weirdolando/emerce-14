import { Text, Grid, GridItem, Box, Stack, Select } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

function Hero({ onChange, currPage, setCurrPage, product }) {
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
        {product.products?.map((product, idx) => {
          return (
            product["is_active"] && (
              <GridItem key={product.id}>
                <ProductCard product={product} idx={idx} />
              </GridItem>
            )
          );
        })}
      </Grid>
      {/* Pagination */}
      <Pagination
        data={product}
        currPage={currPage}
        setCurrPage={setCurrPage}
      />
    </Box>
  );
}

export default Hero;
