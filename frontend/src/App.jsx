import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/product-manage" element={<ProductsManagement />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
