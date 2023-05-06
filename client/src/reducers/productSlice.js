import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";

const BASE_URL = "http://localhost:2000/product";

const initProduct = {
  totalPages: 0,
  products: [],
  categories: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initProduct,
  reducers: {
    setProducts(state, action) {
      return {
        ...state,
        products: [...action.payload.products],
      };
    },
    setTotalPages(state, action) {
      return { ...state, totalPages: action.payload };
    },
    setCategories(state, action) {
      return { ...state, categories: action.payload };
    },
  },
});

export const { setProducts, setTotalPages, setCategories } =
  productSlice.actions;

export function fetchProducts(query = "") {
  return async (dispatch) => {
    try {
      const total = await axios.get(`${BASE_URL}/total${query}`);
      dispatch(setTotalPages(Math.ceil(total.data["total_products"] / 9)));
      const res = await axios.get(`${BASE_URL}${query}`);
      dispatch(setProducts({ products: res.data.data }));
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function fetchStoreProducts(query = "") {
  return async (dispatch) => {
    try {
      const token = userHelper.getUserToken();
      const total = await axios.get(`${BASE_URL}/store/total${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setTotalPages(Math.ceil(total.data["total_products"] / 9)));
      const res = await axios.get(`${BASE_URL}/store${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setProducts({ products: res.data.data }));
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function fetchCategories() {
  return async (dispatch) => {
    try {
      const categories = await axios.get(`${BASE_URL}/category`);
      dispatch(setCategories(categories.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };
}

export default productSlice.reducer;
