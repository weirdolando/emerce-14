import { Routes, Route } from "react-router-dom";

import RegisterLogin from "./pages/RegisterLogin";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";

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
      </Routes>
    </div>
  );
}

export default App;
