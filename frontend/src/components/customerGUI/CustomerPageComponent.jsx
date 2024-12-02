import React, {useContext} from "react";
import Header from "../Header";
import Footer from "../Footer";
import HomePage from "./HomePage";
import ViewDetail from "./ViewProductDetail";
import UserAccountManagement from "./UserAccount";
import Login from "../Login"
import { useData } from "./FetchData";
import ShoppingPage from "./Shopping";
import Categories from "./Category";

function PageComponent() {
    const { state, NavigateTo, ViewCategories, ViewProductDetail } = useData();
    const RenderPage = () => {
        switch (state.currentPage) {
            case 'Login':
                return <Login/>
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
                alert(state.currentPage)
                return <UserAccountManagement 
                    NavigateTo={NavigateTo}
                    state={state}
                />;
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
