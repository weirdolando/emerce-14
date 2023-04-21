import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import userHelper from "../helper/user";
import { getCurrUser } from "../reducers/userSlice";

function RequireAuth({ children }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrUser());
  }, []);

  /**
   * !FIXME:
   * * when the token is about to be removed in the previous `useEffect` dispatch,
   * * this `useEffect` runs before the token is removed,
   * * thus the page doesn't navigate to the /login page
   */
  useEffect(() => {
    const token = userHelper.getUserToken();
    if (!token) navigate("/login");
  }, [user]);

  return children;
}

export default RequireAuth;
