import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

/** NGOC */
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import ProductsManagement from "./pages/ProductsManagement";
import NewProduct from "./pages/NewProduct";
import ProductUpdate from "./pages/ProductUpdate";
import Homepage from "./pages/Homepage";
import TransactionHist from "./pages/TransactionHist";
import ProductDetail from "./pages/ProductDetail";
import ProductByCat from "./pages/ProductByCat";
import Test from "./pages/Test";
import Shopping from './pages/Shopping'
import NewPromotion from "./pages/NewPromotion";
import UsersManagement from "./pages/UsersManagement";
// import AllPromotion from "./components/customerGUI/AllPromotion";
import AllPromotion from "./pages/AllPromotion";
import Checkout from "./components/customerGUI/Checkout";
import Dashboard from "./pages/Dashboard";

/** DUONG */
import HomePage from "./components/customerGUI/HomePage";
import ViewDetail from './components/customerGUI/ViewProductDetail'
import ShoppingPage from './components/customerGUI/Shopping'
import Cart from './components/customerGUI/Cart'
import Categories from './components/customerGUI/Category'
import PostNotification from "./components/customerGUI/adminGUI/PostNotification";
import UserAccountManagement from "./components/customerGUI/UserAccountManagement";
import { Notification, History, UpdateAdress, UpdateData, UpdatePassword, UpdatePhone, Ranking } from "./components/customerGUI/UserAccountManagement";
//import AllPromotion from "./pages/AllPromotion";
import CategoryProduct from './components/customerGUI/CategoryCard'
import UpdatePromo from "./pages/UpdatePromo";
//import ViewDetail from "./components/customerGUI/ViewProductDetail";
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
         <Route path="/test" element={<Test />} />
          <Route path="/user/homepage" element={<HomePage />} />
          <Route path="/user/info" element={<UserAccountManagement />}>
            {/* Các route con */}
            <Route index element={<UpdateData />} />
            <Route path="address" element={<UpdateAdress />} />
            <Route path="phone" element={<UpdatePhone />} />
            <Route path="password" element={<UpdatePassword />} />
            <Route path="history-log" element={<History />} />
            <Route path="rank" element={<Ranking />} />
            <Route path="notification" element={<Notification />} />
          </Route>
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/shopping" element={<ShoppingPage />} />
          <Route path="/category/:id" element={<Categories />} />
          <Route path="/user/category/:id" element={<CategoryProduct />} />
          <Route path="/product-detail/:id" element={<ViewDetail />} />
          <Route path="/customer/pay" element={<Checkout />} />
          <Route path="/user/promotion" element={<AllPromotion />} />

          <Route path="/admin/post-notification" element={<PostNotification />} />
          
        {/* Product Manage */}
          <Route path="/admin/product-manage" element={<ProductsManagement />} />
          <Route path="/admin/product-new" element={<NewProduct />} />
          {/* <Route path="/admin/product-update" element={<ProductUpdate />} /> */}
          <Route path="/admin/edit-product/:id" element={<ProductUpdate />} />
        {/* Promo Manage */}
          <Route path="/admin/all-promo" element={<AllPromotion />} />
          <Route path="/admin/new-promotion" element={<NewPromotion />} />
          <Route path="/admin/edit-promotion/:id" element={<UpdatePromo />} /> 
        {/* User Manage */}
          <Route path="/admin/user-management" element={<UsersManagement />} />
          <Route path="/admin/history/:userID" element={<TransactionHist />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
