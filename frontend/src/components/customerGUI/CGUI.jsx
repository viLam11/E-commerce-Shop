import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AuthProvider, { useAuth } from "./CGUIProvider";
import { useContext } from "react";
import HomePage from "./HomePage";
import Login from "../Login";
import ViewDetail from "./ViewProductDetail";
import ShoppingPage from "./Shopping";
import Categories from "./Category";
import Header from "../Header";
import Footer from "../Footer";
import UserAccountManagement from "./UserAccount";
import Cart from "./Cart";


function CGUI() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider >
        <Header />
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/user/homepage" element={<HomePage/>}/>
          <Route path="/user/info" element={<UserAccountManagement />} />
          <Route path="/user/cart" element={<Cart/>} />
          <Route path="/user/shopping" element={<ShoppingPage/>}/>
          <Route path="/category/:id" element={<Categories />}/>
          <Route path="/product-detail/:id" element={<ViewDetail />}/>
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default CGUI;
