import {
  Box,
  Button,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Image,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserTransactions } from "../reducers/transactionSlice";
import Pagination from "./Pagination";

const TransactionMenu = ({ transaction }) => {
  return (
    <Stack
      p={3}
      py={3}
      justifyContent={{
        base: "flex-start",
        md: "space-around",
      }}
      direction={{
        base: "column",
        md: "row",
      }}
      alignItems={{ md: "center" }}
    >
      <Stack direction="column" w="300px">
        <Heading size={"sm"}>
          {new Date(transaction.date.slice(0, 10)).toLocaleDateString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Heading>
        <Text>At {transaction.date.slice(11, 16)}</Text>
        {/* I hardcode 5 as its shipping charges + tax because they're not implemented on backend */}
        <Text fontSize="sm">
          Total:{" "}
          <Text as="span" fontWeight="500">
            ${(transaction.total + 5).toFixed(2)}
          </Text>
        </Text>
      </Stack>

      <Stack direction="row" align="center">
        <Icon as={FaCheckCircle} color="green.500" />
        <Text>Success</Text>
      </Stack>

      <Stack direction={{ base: "column", md: "row" }}>
        <Image
          src={transaction.products[0].image}
          w="100px"
          h="50px"
          objectFit="contain"
        />
        <Stack direction="column">
          <Text maxW="300px" isTruncated>
            {transaction.products[0]["product_name"]}
          </Text>
          <Text fontSize={"xs"}>
            {transaction.products.length > 1 &&
              `+ ${transaction.products.length - 1} other item`}
            {transaction.products.length - 1 > 1 && "s"}
          </Text>
        </Stack>
      </Stack>
      <Stack>
        {/* TODO: Implement transaction detail page maybe? */}
        <Button size="md" colorScheme="pink">
          Detail
        </Button>
      </Stack>
    </Stack>
  );
};
const Transaction = () => {
  const [currPage, setCurrPage] = useState(1);
  const [filter, setFilter] = useState({ start: "", end: "" });
  const transactionData = useSelector((state) => state.transaction);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        let query = `?page=${currPage}`;
        if (filter.start && filter.end) {
          query += `&start=${filter.start}&end=${filter.end}`;
        }
        await dispatch(fetchUserTransactions(query));
      } catch (err) {
        console.log(err.message);
        navigate("/login");
      }
    };
    fetchTransactions();
  }, [currPage, filter]);

  // !FIXME: The issue is the same as in Home.jsx
  useEffect(() => {
    setCurrPage(1);
  }, [transactionData.totalPages]);

  return (
    <Box py={6} px={5} min={"100vh"}>
      <Stack
        direction={{ base: "column", md: "row" }}
        width="80%"
        margin="0 auto"
        mb={4}
      >
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
      {(!filter.start || !filter.end) && <Text my={4}>Last 7 Days</Text>}
      <Divider />
      {transactionData.transactions.map((transaction) => (
        <Box key={transaction.id}>
          <TransactionMenu transaction={transaction} />
          <Divider />
        </Box>
      ))}
      <Pagination
        data={transactionData}
        currPage={currPage}
        setCurrPage={setCurrPage}
      />
    </Box>
  );
};

export default Transaction;
