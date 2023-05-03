import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";
import Swal from "sweetalert2";
import { redirect } from "react-router-dom";

const BASE_URL = "http://localhost:2000/transactions";

const initTransaction = {
  totalPages: 0,
  transactions: [],
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState: initTransaction,
  reducers: {
    setTransactions(state, action) {
      return {
        ...state,
        transactions: [...action.payload.transactions],
      };
    },
    setTotalPages(state, action) {
      return { ...state, totalPages: action.payload };
    },
  },
});

export const { setTransactions, setTotalPages } = transactionSlice.actions;

export function fetchTransactions(query = "") {
  return async (dispatch) => {
    const token = userHelper.getUserToken();
    const total = await axios.get(`${BASE_URL}/total${query}`);
    dispatch(setTotalPages(Math.ceil(total.data["total_products"] / 9))),
      {
        headers: { Authorization: `Bearer ${token}` },
      };
    const res = await axios.get(`${BASE_URL}${query}`);
    dispatch(setTransactions({ products: res.data.data }), {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
}

export function addTransactions(data) {
  return async () => {
    const token = userHelper.getUserToken();
    await axios.post(BASE_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
}

export default transactionSlice.reducer;
