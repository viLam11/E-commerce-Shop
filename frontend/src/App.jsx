import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/product-manage" element={<ProductsManagement />} />
          <Route path="/product-new"element={<NewProduct />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
