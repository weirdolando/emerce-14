import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";

const BASE_URL = "http://localhost:2000/cart/products";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    setCartItems(state, action) {
      return action.payload;
    },
  },
});

export const { setCartItems } = cartSlice.actions;

export function fetchCartItems() {
  return async (dispatch) => {
    const token = userHelper.getUserToken();
    const cartItems = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setCartItems(cartItems.data.data));
  };
}

export function postCartItems(productId) {
  return async (dispatch) => {
    const token = userHelper.getUserToken();
    await axios.post(
      BASE_URL,
      { id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await dispatch(fetchCartItems());
  };
}

export function editCartItems(productId, qty) {
  return async (dispatch) => {
    try {
      const token = userHelper.getUserToken();
      await axios.patch(
        BASE_URL,
        { id: productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await dispatch(fetchCartItems());
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function deleteCartItems(productId) {
  return async (dispatch) => {
    try {
      const token = userHelper.getUserToken();
      await axios.delete(`${BASE_URL}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await dispatch(fetchCartItems());
    } catch (err) {
      console.log(err.message);
    }
  };
}

export default cartSlice.reducer;
