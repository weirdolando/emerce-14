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
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const EditCategoryForm = () => {
    const navigate = useNavigate();
    let category_id = useParams().id

    const [categoryValue, setCategoryValue] = useState("");
    async function fetchCategoryValue() {
        let url = "http://localhost:2000/product/category/"+category_id

        const categoryData = await axios.get(url);
        setCategoryValue(categoryData.data.data)
    }

    fetchCategoryValue();
    // console.log(categoryValue)

    const editCategory = async () => {
        try {
            const data = {
                category: document.getElementById("name").value,
            };

            const url = "http://localhost:2000/product/category/"+category_id;
            const result = await axios.patch(url, data);

            document.getElementById("name").value = "";

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
                        Edit Category
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
                                <FormLabel>Category Name</FormLabel>
                                <Input type="text" defaultValue={categoryValue.category}/>
                            </FormControl>
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
                                onClick={editCategory}
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
