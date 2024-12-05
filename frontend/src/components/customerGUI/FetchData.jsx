import React, { createContext, useContext, useState, useEffect } from "react";

export const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [state, setState] = useState({
        currentPage: "Login",
        productData: [],
        categoryData: [],
        currentUser: [],
        searchData: [],
        currentProduct: null,
        currentCategory: null,
        currentImage: null,
    });

    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [error, setError] = useState(null);     // Error state for handling fetch errors
    const handleUserData = (loadedUser) =>{
        setState(prevState => ({
            ...prevState,
            currentUser: loadedUser
        }))
    }
    // Navigate to a specific page
    const NavigateTo = (page) => {
        if (state.currentPage != page) {
            setState(prev => ({ ...prev, currentPage: page }));
        }
        //setState(prev => ({ ...prev, currentPage: page }));
        // Chỉ đẩy trạng thái vào lịch sử nếu khác page hiện tại
        if (window.location.hash !== `#${page}`) {
            window.history.pushState({ page }, "", `#${page}`);
        }
    };

    // View product detail
    const ViewProductDetail = (product_id) => {
        setState((prevState) => ({
            ...prevState,
            currentPage: "View",
            currentProduct: product_id,
        }));
        window.history.pushState({ page: "View" }, "", `#View`);
    };

    // View categories
    const ViewCategories = (cate_id) => {
        setState((prevState) => ({
            ...prevState,
            currentPage: "Categories",
            currentCategory: cate_id,
        }));
        window.history.pushState({ page: "Categories" }, "", `#Categories`);
    };

    const Search = (data) =>{
        setState((prev) => ({
            ...prev,
            productData: data
        }))
    }

    // Fetch product and category data
    useEffect(() => {
        let isMounted = true; // To prevent state updates after unmount

        const fetchData = async () => {
            try {
                // Fetch products
                const productResponse = await fetch(
                    "http://localhost:8000/api/product/getAll"
                );
                if (!productResponse.ok) throw new Error("Failed to fetch products");
                const productDataf = await productResponse.json();

                // Fetch categories
                const categoryResponse = await fetch(
                    "http://localhost:8000/api/category/getAll"
                );
                if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
                const categoryDataf = await categoryResponse.json();

                if (isMounted) {
                    setState((prevState) => ({
                        ...prevState,
                        productData: productDataf.data || [],
                        categoryData: categoryDataf.data || [],
                    }));
                    setError(null);
                }
            } catch (error) {
                if (isMounted) setError(error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, []);

    // Listen for browser back/forward navigation
    useEffect(() => {
        const handlePopState = (event) => {
            const page = event.state?.page || "HomePage";
            setState((prevState) => ({
                ...prevState,
                currentPage: page,
            }));
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // Render loading or error states
    if (loading) return <p>Loading data, please wait...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <DataContext.Provider
            value={{ state, NavigateTo, ViewCategories, ViewProductDetail, handleUserData, Search }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}

export default DataContext;
