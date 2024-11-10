import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";
import ProductUpdate from "./pages/ProductUpdate";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/product-manage" element={<ProductsManagement />} />
          <Route path="/product-new"element={<NewProduct />} />
          <Route path="/product-update"element={<ProductUpdate />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
