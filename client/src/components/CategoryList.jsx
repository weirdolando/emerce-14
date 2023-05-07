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
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer
} from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";
import { useState } from "react"
import axios from "axios";

export const CategoryList = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    async function fetchCategories() {
        let url = "http://localhost:2000/product/category"

        const categoryList = await axios.get(url);
        setCategories(categoryList.data.data)
    }

    fetchCategories();

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
                        Category List
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
                            <TableContainer>
                                <Table variant='simple'>
                                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                    <Thead>
                                    <Tr>
                                        <Th>Category Name</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                    </Thead>

                                    <Tbody>
                                    {categories.map((category) => {
                                        return (
                                            <Tr>
                                                <Td>{category.category}</Td>
                                                <Td><Link onClick={() =>navigate("/edit-category/" + category.id)}>Edit</Link></Td>
                                            </Tr>
                                        )
                                    })};
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>
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
