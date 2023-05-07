import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
} from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";
import { useState } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";

export const EditProductForm = () => {
    const navigate = useNavigate();
    let product_id = useParams().id


    const [productValue, setProductValue] = useState("");
    async function fetchProductValue() {
        let url_detail = "http://localhost:2000/product/"+product_id

        const productData = await axios.get(url_detail);
        setProductValue(productData.data.data)
    }

    fetchProductValue();
    // console.log(productValue)

    const [categories, setCategories] = useState([]);
    async function fetchCategories() {
        let url = "http://localhost:2000/product/category"

        const categoryList = await axios.get(url);
        setCategories(categoryList.data.data)
    }

    fetchCategories();

    const optionList = categories.map((item) => item.id == productValue.category_id ? (<option value={item.id} selected>{item.category}</option>) : (<option value={item.id}>{item.category}</option>));

    const editProduct = async () => {
        try {
            const data = {
                product_name: document.getElementById("name").value,
                description: document.getElementById("description").value,
                price: document.getElementById("price").value,
                stock: document.getElementById("stock").value,
                image: document.getElementById("image").value,
                is_active: document.getElementById("is_active").value,
                category_id: document.getElementById("category_id").value,
                store_id: 1,
            };

            const url = "http://localhost:2000/product/"+product_id;
            const result = await axios.patch(url, data);

            document.getElementById("name").value = "";
            document.getElementById("description").value = "";
            document.getElementById("price").value = "";
            document.getElementById("stock").value = "";
            document.getElementById("image").value = "";
            document.getElementById("is_active").value = "";
            document.getElementById("category_id").value = "";

            setTimeout(() => {
                navigate(-1);
            }, 500);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={500}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Edit Product
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <VStack>
                            <FormControl id="name" isRequired>
                                <FormLabel>Product Name</FormLabel>
                                <Input type="text" defaultValue={productValue.product_name} />
                            </FormControl>
                            <FormControl id="description" isRequired>
                                <FormLabel>Description</FormLabel>
                                <Input type="text" defaultValue={productValue.description}/>
                            </FormControl>
                            <FormControl id="price" isRequired>
                                <FormLabel>Price</FormLabel>
                                <Input type="text" defaultValue={productValue.price}/>
                            </FormControl>
                            <FormControl id="stock" isRequired>
                                <FormLabel>Stock</FormLabel>
                                <Input type="text" defaultValue={productValue.stock}/>
                            </FormControl>
                            <FormControl id="image" isRequired>
                                <FormLabel>Image</FormLabel>
                                <Input type="text" defaultValue={productValue.image}/>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Is Active?</FormLabel>
                                <Select id="is_active" placeholder="is Active?">
                                    {productValue.is_active == 1 ? (<option value="1" selected>Active</option>) : (<option value="1">Active</option>)}
                                    {productValue.is_active == 0 ? (<option value="0" selected>Inactive</option>) : (<option value="0">Inactive</option>)}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Category</FormLabel>
                                <Select id="category_id" placeholder="Select Category">
                                    {optionList}
                                </Select>
                            </FormControl>
                            
                            <Link
                                    color={"blue.400"}
                                    onClick={() => navigate("/add-category")}
                                >
                                    New category
                            </Link>
                        </VStack>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={"pink.400"}
                                _hover={{
                                    bg: "pink.300",
                                }}
                                variant="solid"
                                color="white"
                                onClick={editProduct}
                            >
                                Done
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                <Link
                                    color={"blue.400"}
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};
