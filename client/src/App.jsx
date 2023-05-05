import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import RegisterLogin from "./pages/RegisterLogin";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartDetailPage from "./pages/CartDetailPage";
import TransactionPage from "./pages/TransactionPage";
import { getCurrUser } from "./reducers/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrUser());
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<RegisterLogin page="register" />} />
        <Route path="/login" element={<RegisterLogin page="login" />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartDetailPage />} />
        <Route path="/history" element={<TransactionPage />} />
      </Routes>
    </div>
  );
}

export default App;
