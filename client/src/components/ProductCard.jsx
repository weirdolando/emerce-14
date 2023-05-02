import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { postCartItems } from "../reducers/cartSlice";
import { useDispatch } from "react-redux";

function Rating({ rating, numReviews }) {
  rating = (Math.random() * (5 - 4) + 4).toFixed(1);
  numReviews = Math.floor(Math.random() * (242 - 50 + 1) + 50);

  return (
    <Box display="flex" align="center">
      {Array(5)
        .fill("")
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return (
              <BsStarFill
                key={i}
                style={{ marginLeft: "1" }}
                color={i < rating ? "teal.500" : "gray.300"}
              />
            );
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
          }
          return <BsStar key={i} style={{ marginLeft: "1" }} />;
        })}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {numReviews} review{numReviews > 1 && "s"}
      </Box>
    </Box>
  );
}

function ProductCart({ product = {}, idx = 0, page = "product" }) {
  const dispatch = useDispatch();

  function handleAddCart(e) {
    e.preventDefault();
    dispatch(postCartItems(product.id));
  }

  return (
    <Box
      bg="white"
      maxW="300px"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative"
      display="block"
      as={Link}
      to={`product/${product.id}`}
    >
      {page === "report" && idx < 5 && (
        <Circle
          size="10px"
          position="absolute"
          top={2}
          right={2}
          bg="red.200"
        />
      )}

      <Image
        src={product.image}
        alt={`Picture of ${product["product_name"]}`}
        roundedTop="lg"
        boxSize="300px"
        objectFit="contain"
        margin="0 auto"
        p={4}
      />

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {/* Add Best Seller tag for top 5 products */}
          {page === "report" && idx < 5 && (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              Best Seller
            </Badge>
          )}
        </Box>
        <Flex
          mt="1"
          justifyContent="space-between"
          alignContent="center"
          align="center"
        >
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {product["product_name"]}
          </Box>
          <Tooltip
            label="Add to cart"
            bg="white"
            placement={"top"}
            color={"gray.800"}
            fontSize={"1.2em"}
          >
            <IconButton
              size="lg"
              aria-label="Add to cart"
              variant="ghost"
              onClick={handleAddCart}
              icon={<FiShoppingCart />}
            />
          </Tooltip>
        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Box fontSize="2xl" color="gray.800">
            <Box as="span" color={"gray.600"} fontSize="lg">
              $
            </Box>
            {product.price.toFixed(2)}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default ProductCart;
