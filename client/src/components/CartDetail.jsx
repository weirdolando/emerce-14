import {
  Text,
  Flex,
  Grid,
  GridItem,
  Box,
  Stack,
  VStack,
  HStack,
  Image,
  Button,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsTrashFill } from "react-icons/bs";
import { RiExternalLinkLine } from "react-icons/ri";
import Swal from "sweetalert2";
import {
  fetchCartItems,
  editCartItems,
  deleteCartItems,
} from "../reducers/cartSlice";
import { addTransactions } from "../reducers/transactionSlice";
import { Link } from "react-router-dom";

function CartDetail() {
  const productsInCart = useSelector((state) => state.cart);
  const subtotal = productsInCart.reduce(
    (acc, product) => acc + product.price * product.qty,
    0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If no products in cart i.e. when the user refresh the page, fetch cart items
    if (!productsInCart.length) {
      const fetchItems = async () => {
        try {
          await dispatch(fetchCartItems());
        } catch (err) {
          console.log(err.message);
          navigate("/login");
        }
      };
      fetchItems();
    }
  }, []);
  return (
    <Grid
      mt={8}
      gridTemplateColumns="1fr"
      sx={{ "@media (min-width: 995px)": { gridTemplateColumns: "2fr 1fr" } }}
      width="80%"
      maxW="1200px"
      mx="auto"
      gap={12}
    >
      <GridItem>
        {productsInCart.map((product) => (
          <Flex
            gap={2}
            justify="space-between"
            direction="column"
            alignItems="center"
            sx={{
              "@media (min-width: 540px)": { flexDirection: "row", gap: 8 },
            }}
            key={product.id}
            my={8}
          >
            <Image src={product.image} w="150px" objectFit="contain" />
            <Flex direction="column" grow={1}>
              <Text>{product["product_name"]}</Text>
              <Flex align="center" gap={4} mt={2}>
                <Button
                  isDisabled={product.qty <= 1}
                  onClick={() => {
                    dispatch(editCartItems(product.id, product.qty - 1));
                  }}
                >
                  -
                </Button>
                <Text as="span" fontWeight={500}>
                  {product.qty}
                </Text>
                <Button
                  onClick={() => {
                    dispatch(editCartItems(product.id, product.qty + 1));
                  }}
                >
                  +
                </Button>
                <IconButton
                  aria-label="Delete product from cart"
                  icon={<BsTrashFill />}
                  colorScheme="red"
                  onClick={() => {
                    Swal.fire({
                      icon: "warning",
                      title: "Delete product?",
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                      confirmButtonColor: "#d53f8c",
                    }).then((result) => {
                      if (result.isConfirmed)
                        dispatch(deleteCartItems(product.id));
                    });
                  }}
                />
                <IconButton
                  aria-label="View product"
                  colorScheme="pink"
                  variant="outline"
                  icon={<RiExternalLinkLine />}
                  as={Link}
                  to={`/product/${product.id}`}
                />
              </Flex>
            </Flex>
            <Text color="pink.400" fontWeight={500} ml="auto">
              ${(product.price * product.qty).toFixed(2)}
            </Text>
          </Flex>
        ))}
      </GridItem>
      <GridItem mt={{ base: "50px", md: "0px" }}>
        <Box
          border="1px"
          borderColor="gray.200"
          boxShadow="md"
          rounded="md"
          p={4}
        >
          <Text fontWeight={500} fontSize="2xl">
            Order Summary
          </Text>
          <Divider my={2} />
          <Flex gap={4} justify="space-between" align="center">
            <Text>Subtotal:</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </Flex>
          <Flex gap={4} justify="space-between" align="center">
            <Text>Shipping Charges:</Text>
            <Text>$4</Text>
          </Flex>
          <Flex gap={4} justify="space-between" align="center">
            <Text>Tax:</Text>
            <Text>$1</Text>
          </Flex>
          <Divider my={2} />
          <Flex gap={4} justify="space-between" align="center" fontWeight={500}>
            <Text>Total:</Text>
            <Text color="pink.400">${(subtotal + 4 + 1).toFixed(2)}</Text>
          </Flex>
          <Button
            textTransform="uppercase"
            colorScheme="pink"
            mt={8}
            w="100%"
            onClick={async () => {
              try {
                await dispatch(
                  addTransactions({ carts: productsInCart, subtotal })
                );
                const result = await Swal.fire({
                  icon: "success",
                  title: "Payment Successful",
                  confirmButtonColor: "#d53f8c",
                });
                if (result.isConfirmed) navigate("/history");
              } catch (err) {
                console.log(err.message);
                navigate("/login");
              }
            }}
          >
            Checkout
          </Button>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default CartDetail;
