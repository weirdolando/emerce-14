import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import RegisterLogin from "./pages/RegisterLogin";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterLogin page="register" />} />
        <Route path="/login" element={<RegisterLogin page="login" />} />
      </Routes>
    </div>
  );
}

export default App;
