import React, {useContext} from "react";
import Header from "../Header";
import Footer from "../Footer";
import HomePage from "./HomePage";
import ViewDetail from "./ViewProductDetail";
import UserAccountManagement from "./UserAccount";
import Login from "../guest/Login"
import { useData } from "./FetchData";
import ShoppingPage from "./Shopping";
import Categories from "./Category";
import Cart from "./Cart";
import MakeOrder from "./MakeOrder";

function PageComponent() {
    const { state, NavigateTo, ViewCategories, ViewProductDetail, handleUserData, Search , CartToOrder } = useData();
    const RenderPage = () => {
        switch (state.currentPage) {
            case 'Login':
                return <Login
                    handleUserData = {handleUserData}
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    state={state}
                />
            case "HomePage":
                return <HomePage  
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    state={state}
                />;
            case "Categories":
                return<Categories 
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    state={state}
                />
            case "View":
                return <ViewDetail 
                    state={state}
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                />;
            case "Shopping":
                return <ShoppingPage 
                    state={state}
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                />;
            case "User":
                return <UserAccountManagement 
                    NavigateTo={NavigateTo}
                    state={state}
                />;
            case "Cart":
                return <Cart 
                    state={state}
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    CartToOrder={CartToOrder}
                />
            case "Order":
                return <MakeOrder 
                    state={state}
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    CartToOrder={CartToOrder}
                />
            default:
                return <HomePage  
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    state={state}
                />;
        }
    };
    return (
        <>
            <Header 
                NavigateTo={NavigateTo} 
                ViewCategories={ViewCategories}
                ViewProductDetail={ViewProductDetail}
                state={state}
                Search={Search}
            />
            <RenderPage 
                NavigateTo={NavigateTo} 
                ViewCategories={ViewCategories}
                ViewProductDetail={ViewProductDetail}
                state={state}
            />
            <Footer />
        </>
    );
}

export default PageComponent;
