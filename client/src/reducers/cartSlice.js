import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";
import Swal from "sweetalert2";

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
    try {
      const token = userHelper.getUserToken();
      const cartItems = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCartItems(cartItems.data.data));
    } catch (err) {
      console.log(err.message);
      //TODO: Redirect to login page?
    }
  };
}

export function postCartItems(productId) {
  return async (dispatch) => {
    try {
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
      dispatch(fetchCartItems());
      Swal.fire({
        position: "center",
        title: "✅ Added to cart",
        width: "300px",
        showConfirmButton: false,
        timer: 700,
      });
    } catch (err) {
      console.log(err.message);
    }
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
      dispatch(fetchCartItems());
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
      dispatch(fetchCartItems());
    } catch (err) {
      console.log(err.message);
    }
  };
}

export default cartSlice.reducer;
