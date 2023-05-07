import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import RegisterLogin from "./pages/RegisterLogin";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartDetailPage from "./pages/CartDetailPage";
import TransactionPage from "./pages/TransactionPage";
import { getCurrUser } from "./reducers/userSlice";
import { AddProductForm } from "./components/AddProductForm";
import { AddCategoryForm } from "./components/AddCategoryForm";
import { EditProductForm } from "./components/EditProductForm";
import { EditCategoryForm } from "./components/EditCategoryForm";
import { DashboardProduct } from "./components/DashboardProduct";
import { CategoryList } from "./components/CategoryList";

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
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/add-category" element={<AddCategoryForm />} />
        <Route path="/edit-product/:id" element={<EditProductForm/>} />
        <Route path="/edit-category/:id" element={<EditCategoryForm/>} />
        <Route path="/dashboard" element={<DashboardProduct/>} />
        <Route path="/category" element={<CategoryList/>} />
      </Routes>
    </div>
  );
}

export default App;
