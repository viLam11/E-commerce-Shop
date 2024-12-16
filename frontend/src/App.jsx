import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";
import ProductUpdate from "./pages/ProductUpdate";
import Homepage2 from "./pages/Homepage2";
import TransactionHist from "./pages/TransactionHist";
import Test from "./pages/Test";
import NewPromotion from "./pages/NewPromotion";
import UsersManagement from "./pages/UsersManagement";
import AllPromotion from "./pages/AllPromotion";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Shopping from "./pages/Shopping";
import ViewDetail from "./pages/ViewDetail";
import ProductByCat from "./pages/ProductByCat";
import ProductDetail from "./pages/ProductDetail";

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

          
          <Route path="/customer/pay" element={<Checkout />}  />
          <Route path="/customer/homepage" element={<Homepage />} />
          <Route path="/customer/shopping" element={<Shopping />} />
          {/* <Route path="/customer/product-detail/:prodID" element={<ViewDetail />} /> */}
          <Route path="/customer/productDetail/:prodID" element={<ProductDetail />} />

          <Route path="/customer/category/:catSlug" element={<ProductByCat />} />



          <Route path="/admin/history/:id" element={<TransactionHist />} />
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
