import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const id = useParams().id;

  useEffect(() => {
    axios
      .get(`http://localhost:2000/product/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error(err.message));
  }, []);

  function parseJsonOrString(str) {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return str;
    }
  }

  // Get product description whether it's an array or a string
  const productDescription = parseJsonOrString(product.description);

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={product.image}
            fit={"contain"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {product["product_name"]}
            </Heading>
            <Text color="gray.900" fontWeight={300} fontSize={"2xl"}>
              ${product.price?.toFixed(2)} USD
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={<StackDivider borderColor="gray.200" />}
          >
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color="pink.400"
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Product Details
              </Text>

              <UnorderedList spacing={2}>
                {typeof productDescription === "string" ? (
                  <ListItem>{productDescription}</ListItem>
                ) : (
                  productDescription?.map((desc, i) => (
                    <ListItem key={i}>{desc}</ListItem>
                  ))
                )}
              </UnorderedList>
            </Box>
            {/* TODO: Add store maybe? if the backend is done or I'm not lazy lol */}
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color="yellow.500"
                fontWeight={"500"}
                mb={"4"}
              >
                Uncle Muthu Store
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>Lorem ipsum dolor</ListItem>
                  <ListItem>Sit amet consectetur adipisicing elit.</ListItem>
                  <ListItem>Soluta, provident!</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Lorem ipsum dolor</ListItem>
                  <ListItem>Sit amet consectetur adipisicing elit.</ListItem>
                  <ListItem>Soluta, provident!</ListItem>
                </List>
              </SimpleGrid>
            </Box>
          </Stack>

          <Button
            rounded={"none"}
            w={"full"}
            mt={8}
            size={"lg"}
            py={"7"}
            bg="pink.400"
            color="white"
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
          >
            Add to cart
          </Button>

          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <MdLocalShipping />
            <Text>2-3 business days delivery</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
