import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:2000/product";

const initProduct = {
  totalPages: 0,
  products: [],
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
  },
});

export const { setProducts, setTotalPages } = productSlice.actions;

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

export default productSlice.reducer;
