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
        localStorage.setItem("currentUser", JSON.stringify(loadedUser));
    }
    
    // Navigate to a specific page
    const NavigateTo = (page) => {
        if (state.currentPage != page) {
            setState(prev => ({ ...prev, currentPage: page }));
        }
        //setState(prev => ({ ...prev, currentPage: page }));
        localStorage.setItem("currentPage", page);
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
        localStorage.setItem("currentPage", "View");
    };

    // View categories
    const ViewCategories = (cate_id) => {
        setState((prevState) => ({
            ...prevState,
            currentPage: "Categories",
            currentCategory: cate_id,
        }));
        window.history.pushState({ page: "Categories" }, "", `#Categories`);
        localStorage.setItem("currentPage", "Categories");
    };
    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        const savedPage = localStorage.getItem("currentPage");

        setState((prevState) => ({
            ...prevState,
            currentUser: savedUser ? JSON.parse(savedUser) : [],
            currentPage: savedPage || "Login",
        }));
    }, []);
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
                    "http://localhost:8000/api/product/getAll?limit=1000"
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
    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000); // 3 seconds
    
        return () => clearTimeout(timer); // Clean up the timer on component unmount
      }, []);
    
      if (loading)
        return (
          <>
            <style>
              {`
                .popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
    
                .popupContent {
                    background: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    width: 300px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
    
                .loading-spinner {
                    margin: 20px auto;
                    border: 8px solid #f3f3f3;
                    border-top: 8px solid #007bff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
    
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
    
                .closePopup {
                    padding: 10px 20px;
                    background-color: #ff4d4d;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                }
    
                .closePopup:hover {
                    background-color: #cc0000;
                }
              `}
            </style>
    
            <div className="popup">
              <div
                className="popupContent"
                onClick={(e) => e.stopPropagation()}
                style={{ width: "400px", height: "300px" }}
              >
                <h2>Đang tải...</h2>
                <div className="loading-spinner"></div>
                <button
                  className="closePopup"
                  onClick={() => setLoading(false)} // Manually stop loading if needed
                >
                  Đóng
                </button>
              </div>
            </div>
          </>
        );
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
