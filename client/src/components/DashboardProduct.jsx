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
// import { Pagination } from "semantic-ui-react";
// import "semantic-ui-css/semantic.min.css";

import axios from "axios";
import { useState, useEffect } from "react";

export function DashboardProduct() {
    const [products, setProducts] = useState([]);
    const [option, setOption] = useState(0);
    const [category_id, setCategoryId] = useState(0);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProducts() {
            let url;

            switch (parseInt(option)) {
                case 1:
                    url = `http://localhost:2000/product/?name=${name}&sort=asc`;
                    break;
                case 2:
                    url = `http://localhost:2000/product/?name=${name}&sort=desc`;
                    break;
                case 3:
                    url = `http://localhost:2000/product/?name=${name}&price=desc`;
                    break;
                case 4:
                    url = `http://localhost:2000/product/?name=${name}&price=asc`;
                    break;
                default:
                    url = `http://localhost:2000/product/?name=${name}`;;
            }

            if(category_id!=0){
                url += `&category_id=${category_id}`
            }

            const productData = await axios.get(url);
            setProducts(productData.data.data);
        }
        fetchProducts();
    }, [option, name, category_id]);

    return (
        <Stack spacing={8} mx={"auto"} w={"80%"} py={12} px={6}>
            <Stack align={"center"}>
                <Heading fontSize={"4xl"} textAlign={"center"} color="black">
                    Dashboard Product
                </Heading>
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
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
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
                                            Stock: {product.stock}
                                        </div>
                                    </Stack>
                                </CardBody>
                                <CardFooter>
                                    <ButtonGroup spacing="2">
                                        <Button
                                            variant="solid"
                                            color="white"
                                            bg={"pink.400"}
                                            _hover={{
                                                bg: "pink.300",
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    "/product/" + product.id
                                                )
                                            }
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            variant="solid"
                                            color="white"
                                            bg={"pink.400"}
                                            _hover={{
                                                bg: "pink.300",
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            </Center>
        </Stack>
    );
}
