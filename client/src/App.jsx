import { Routes, Route } from "react-router-dom";

import RegisterLogin from "./pages/RegisterLogin";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<RegisterLogin page="register" />} />
        <Route path="/login" element={<RegisterLogin page="login" />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/product/:id"
          element={
            <RequireAuth>
              <ProductDetailPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
