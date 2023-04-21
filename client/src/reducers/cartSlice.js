import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";
import userHelper from "../helper/user";

const BASE_URL = "http://localhost:2000/cart/products";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    setCartItems(state, action) {
      return action.payload;
    },
    addCartItems(state, action) {},
    editCartItems(state, action) {},
    deleteCartItems(state, action) {},
  },
});

export const { setCartItems } = cartSlice.actions;

export function fetchCartItems() {
  return async (dispatch) => {
    try {
      const token = userHelper.getUserToken();
      const cartItems = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCartItems(cartItems.data.data));
    } catch (err) {
      console.log(err.message);
      redirect("/login");
    }
  };
}

export default cartSlice.reducer;
