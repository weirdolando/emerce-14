import axios from "axios";

const BASE_URL = "http://localhost:2000/user";
const STORAGE_KEY = "emerce14-token";
let token = null;

function setUserToken(userToken) {
  window.localStorage.setItem(STORAGE_KEY, userToken);
  token = userToken;
}

function getUserToken() {
  token = window.localStorage.getItem(STORAGE_KEY);
  return token;
}

async function registerUserAsync(userData) {
  const res = await axios.post(`${BASE_URL}/register`, userData);
  return res.data;
}

async function getUserAsync() {
  const tokenLocalStorage = getUserToken();
  if (!tokenLocalStorage) throw "No token";
  token = tokenLocalStorage;
  const res = await axios.get(`${BASE_URL}/keeplogin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function loginUserAsync(credentials) {
  const res = await axios.post(`${BASE_URL}/auth`, credentials);
  setUserToken(res.data.token);
}

function clearUserToken() {
  window.localStorage.removeItem(STORAGE_KEY);
  token = null;
}

export default {
  setUserToken,
  registerUserAsync,
  getUserAsync,
  loginUserAsync,
  getUserToken,
  clearUserToken,
};
