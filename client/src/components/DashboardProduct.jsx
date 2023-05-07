import {
    Card,
    CardBody,
    Image,
    Button,
    ButtonGroup,
    Text,
    Heading,
    CardFooter,
    Center,
    SimpleGrid,
    Stack,
    Select,
    Input,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function DashboardProduct() {
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);

    const [option, setOption] = useState(0);
    const [category_id, setCategoryId] = useState(0);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProducts() {
            let url;
            let url_total

            switch (parseInt(option)) {
                case 1:
                    url = `http://localhost:2000/product/?page=${page}&name=${name}&sort=asc`;
                    break;
                case 2:
                    url = `http://localhost:2000/product/?page=${page}&name=${name}&sort=desc`;
                    break;
                case 3:
                    url = `http://localhost:2000/product/?page=${page}&name=${name}&price=desc`;
                    break;
                case 4:
                    url = `http://localhost:2000/product/?page=${page}&name=${name}&price=asc`;
                    break;
                default:
                    url = `http://localhost:2000/product/?page=${page}&name=${name}`;
            }

            url_total = `http://localhost:2000/product/total?name=${name}`;

            if(category_id!=0){
                url += `&category_id=${category_id}`
                url_total += `&category_id=${category_id}`

            }

            const productData = await axios.get(url);
            const totalProduct = await axios.get(url_total);
            setProducts(productData.data.data);
            setTotalPage(Math.ceil(totalProduct.data.total_products/9));
        }
        fetchProducts();
    }, [option, page, name, category_id]);

    const [categories, setCategories] = useState([]);
    async function fetchCategories() {
        let url = "http://localhost:2000/product/category"

        const categoryList = await axios.get(url);
        setCategories(categoryList.data.data)
    }

    fetchCategories();

    const optionList = categories.map((item) => (<option value={item.id}>{item.category}</option>));
    const prevPage = () => {
        if(page>1){
            setPage(page-1)
        }
    }
    const nextPage = () => {
        if(page<totalPage){
            setPage(page+1)
        }
    }

    return (
        <div><Stack spacing={8} mx={"auto"} w={"80%"} py={12} px={6}>
            <Stack align={"center"}>
                <Heading fontSize={"4xl"} textAlign={"center"} color="black">
                    Dashboard Products
                </Heading>
            </Stack>
                

            <ButtonGroup spacing="2">
                <Button
                    variant="solid"
                    bg={"pink.400"}
                    _hover={{
                        bg: "pink.300",
                    }}
                    color="white"
                    onClick={() =>
                        navigate(
                            "/add-product"
                        )
                    }
                >
                    Add Product
                </Button>
                <Button
                    variant="solid"
                    bg={"pink.400"}
                    _hover={{
                        bg: "pink.300",
                    }}
                    color="white"
                    onClick={() =>
                        navigate(
                            "/category"
                        )
                    }
                >
                    Show Category
                </Button>
            </ButtonGroup>
            
            <Stack align={"center"}>
                <Input
                    placeholder="Search product"
                    onChange={(e) => setName(e.target.value)}
                />
                <Select
                    placeholder="Sort by"
                    onChange={(e) => setOption(e.target.value)}
                >
                    <option value="1">Sort by name (a-z)</option>
                    <option value="2">Sort by name (z-a)</option>
                    <option value="3">Sort by price (high-low)</option>
                    <option value="4">Sort by price (low-high)</option>
                </Select>
                <Select
                    placeholder="Filter by category"
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    {optionList}
                </Select>
            </Stack>
            <Center py={6}>
                <SimpleGrid columns={3} spacing={10}>
                    {products.map((product) => {
                        return (
                            <Card
                                maxW="sm"
                                css={{
                                    border: "2px solid whitesmoke",
                                }}
                            >
                                <CardBody>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        borderRadius="lg"
                                        objectFit={"cover"}
                                        h={"200px"}
                                        w={"250px"}
                                        css={{
                                            border: "2px solid whitesmoke",
                                        }}
                                    />
                                    <Stack mt="6" spacing="3">
                                        <Heading size="md">
                                            {product.product_name}
                                        </Heading>
                                        <Text>{product.price}</Text>
                                        <div className="mt-2">
                                            <b>Stock: </b>{product.stock}
                                        </div>
                                        <Text><b>Sold: </b>{product.sold}</Text>
                                        {product.is_active==1 ? <Text color={"green"}>Active</Text> : <Text color={"red"}>Inactive</Text>}

                                    </Stack>
                                </CardBody>
                                <CardFooter>
                                    <ButtonGroup spacing="2">
                                        <Button
                                            variant="solid"
                                            bg={"pink.400"}
                                            _hover={{
                                                bg: "pink.300",
                                            }}

                                            color="white"
                                            onClick={() =>
                                                navigate(
                                                    "/edit-product/" + product.id
                                                )
                                            }
                                        >
                                            Edit Product
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </SimpleGrid>                
            </Center>
            <Center>
                <Link onClick={prevPage}>&#60;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                <Text>Page <b>{page}</b> of <b>{totalPage}</b>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <Link onClick={nextPage}>&#62;</Link>
            </Center>
        </Stack>
        
        </div>
    );
}
