import { createSlice } from "@reduxjs/toolkit";
import userHelper from "../helper/user";

const initUser = {
  currUser: {
    id: null,
    username: "",
    email: "",
    firstname: "",
    lastname: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initUser,
  reducers: {
    setCurrUser(state, action) {
      return {
        ...state,
        currUser: action.payload,
      };
    },
    removeCurrUser() {
      userHelper.clearUserToken();
      return initUser;
    },
  },
});

export const { setCurrUser, removeCurrUser } = userSlice.actions;

export function getCurrUser() {
  return async (dispatch) => {
    try {
      const res = await userHelper.getUserAsync();
      // `res.data` is the user data i.e. id, username, email, firstname, lastname
      dispatch(setCurrUser(res.data));
    } catch (err) {
      dispatch(removeCurrUser());
    }
  };
}

export default userSlice.reducer;
