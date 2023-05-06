import {
  Text,
  Heading,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Box,
  Stack,
  Select,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchStoreTransactions } from "../reducers/transactionSlice";
import { fetchStoreProducts, fetchCategories } from "../reducers/productSlice";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

function Reporting() {
  const [currPage, setCurrPage] = useState(1);
  const [filter, setFilter] = useState({ start: "", end: "", category: 0 });
  const user = useSelector((state) => state.user.currUser);
  const transactionData = useSelector((state) => state.transaction);
  const productData = useSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    const { name, value } = e.target;
    setFilter((f) => ({
      ...f,
      [name]: value,
    }));
  }

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // !TODO: Add pagination to the query if you want to
        let query = "";
        if (filter.start && filter.end) {
          query += `?start=${filter.start}&end=${filter.end}`;
        }
        await dispatch(fetchStoreTransactions(user.storeId, query));
      } catch (err) {
        console.log(err.message);
        navigate("/login");
      }
    };
    fetchTransactions();
  }, [filter.start, filter.end, user]);

  useEffect(() => {
    let query = "";
    if (filter.category) query += `?categoryId=${filter.category}`;
    dispatch(fetchStoreProducts(query));
  }, [currPage, filter.category]);

  // !FIXME: The issue is the same as in Home.jsx
  useEffect(() => {
    setCurrPage(1);
  }, [productData.totalPages]);

  return (
    <Box py={6} px={5} min={"100vh"}>
      <Heading>Gross Income & Transactions</Heading>
      <Stack direction={{ base: "column", md: "row" }} width="50%" my={4}>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            name="start"
            onChange={handleChange}
            value={filter.start}
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            name="end"
            onChange={handleChange}
            value={filter.end}
          />
        </FormControl>
      </Stack>
      {(!filter.start || !filter.end) && (
        <Text fontSize="xl" mt={4}>
          Last 7 Days
        </Text>
      )}
      <Text fontSize="lg">
        Gross Income:{" "}
        <Text as="span" fontWeight={500} color="pink.400">
          ${transactionData.transactions.reduce((acc, e) => acc + e.total, 0)}
        </Text>
      </Text>
      <Text fontSize="lg">
        Total Transactions:{" "}
        <Text as="span" fontWeight={500} color="pink.400">
          {transactionData.transactions.length}
        </Text>
      </Text>

      <Heading mt={8} mb={4}>
        Products
      </Heading>
      <Grid
        mt={4}
        templateColumns="repeat(auto-fit, 300px)"
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
      >
        <GridItem colStart={1} colEnd={-1}>
          <Select
            placeholder="Category"
            name="category"
            margin="0 auto"
            onChange={handleChange}
          >
            {productData.categories.map((e) => (
              <option key={e.id} value={e.id}>
                {e.category}
              </option>
            ))}
          </Select>
        </GridItem>
        {productData.products.map((product, idx) => (
          <GridItem key={product.id}>
            <ProductCard product={product} idx={idx} page="report" />
          </GridItem>
        ))}
      </Grid>
      <Pagination
        data={productData}
        currPage={currPage}
        setCurrPage={setCurrPage}
      />
    </Box>
  );
}

export default Reporting;
