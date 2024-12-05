import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";
import ProductUpdate from "./pages/ProductUpdate";
import Homepage from "./pages/Homepage";
import TransactionHist from "./pages/TransactionHist";
import Test from "./pages/Test";
import NewPromotion from "./pages/NewPromotion";
import UsersManagement from "./pages/UsersManagement";
import AllPromotion from "./pages/AllPromotion";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";

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
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Login />} />

          <Route path="/customer/history" element={<TransactionHist />} />
          <Route path="/customer/pay" element={<Checkout />} />
          <Route path="/customer/homepage" element={<Homepage />} />
 
          <Route path="/admin/product-manage" element={<ProductsManagement />} />
          <Route path="/admin/product-new" element={<NewProduct />} />
          <Route path="/admin//product-update" element={<ProductUpdate />} />
          <Route path="/admin/edit-product/:id" element={<ProductUpdate />} />
          <Route path="/admin/new-promotion" element={<NewPromotion />} />
          <Route path="/admin/user-management" element={<UsersManagement />} />
          <Route path="/admin/all-promo" element={<AllPromotion />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
