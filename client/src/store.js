import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import productReducer from "./reducers/productSlice";
import cartReducer from "./reducers/cartSlice";
import transactionReducer from "./reducers/transactionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    transaction: transactionReducer,
  },
});

export default store;
