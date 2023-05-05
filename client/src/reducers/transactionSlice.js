import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";

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
        transactions: action.payload,
      };
    },
    setTotalPages(state, action) {
      return { ...state, totalPages: action.payload };
    },
  },
});

export const { setTransactions, setTotalPages } = transactionSlice.actions;

export function fetchUserTransactions(query = "") {
  return async (dispatch) => {
    const token = userHelper.getUserToken();
    const total = await axios.get(`${BASE_URL}/user/total/${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setTotalPages(Math.ceil(total.data["total_transactions"] / 9)));
    const res = await axios.get(`${BASE_URL}/user/${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setTransactions(res.data.transactions), {
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
