import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";
import ProductUpdate from "./pages/ProductUpdate";
//import Homepage2 from "./pages/Homepage2";
import TransactionHist from "./pages/TransactionHist";
import Test from "./pages/Test";
import NewPromotion from "./pages/NewPromotion";
import UsersManagement from "./pages/UsersManagement";
import AllPromotion from "./pages/AllPromotion";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import HomePage from "./components/customerGUI/HomePage";
import ViewDetail from './components/customerGUI/ViewProductDetail'
import ShoppingPage from './components/customerGUI/Shopping'
import Cart from './components/customerGUI/Cart'
import Categories from './components/customerGUI/Category'
import UserAccountManagement from "./components/customerGUI/UserAccountManagement";

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
          <Route path="/user/homepage" element={<HomePage />} />
          <Route path="/user/info" element={<UserAccountManagement />} />
           <Route path="/user/cart" element={<Cart/>} />
          <Route path="/user/shopping" element={<ShoppingPage/>}/>
          <Route path="/category/:id" element={<Categories />}/>
          <Route path="/product-detail/:id" element={<ViewDetail />}/>
          <Route path="/customer/pay" element={<Checkout />}  />



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
