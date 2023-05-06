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
import Hero from "./Hero";

function Reporting() {
  const [currPage, setCurrPage] = useState(1);
  const [filter, setFilter] = useState({ start: "", end: "" });
  const user = useSelector((state) => state.user.currUser);
  const transactionData = useSelector((state) => state.transaction);
  const product = useSelector((state) => state.product);
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
  }, [filter, user]);

  // useEffect(() => {
  //   // TODO: Add fetchProducts using storeId on productController
  //   dispatch(fetchProducts(query));
  // }, [currPage]);

  // !FIXME: The issue is the same as in Home.jsx
  // useEffect(() => {
  //   setCurrPage(1);
  // }, [transactionData.totalPages]);

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
        <Text fontSize="xl" my={4}>
          Last 7 Days
        </Text>
      )}
      <Text fontSize="xl">
        Gross Income:{" "}
        <Text as="span" fontWeight={500} color="pink.400">
          ${transactionData.transactions.reduce((acc, e) => acc + e.total, 0)}
        </Text>
      </Text>
      <Text fontSize="xl">
        Total Transactions:{" "}
        <Text as="span" fontWeight={500} color="pink.400">
          {transactionData.transactions.length}
        </Text>
      </Text>
    </Box>
  );
}

export default Reporting;
