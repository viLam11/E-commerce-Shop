import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

// import ProductCard from "../components/ProductCard";
import ProductCartSmall from "../components/ProductCardSmall";

export default function ProductByCat() {
    const { catSlug } = useParams();   
    // alert(catSlug); 
    let catName;
    if (catSlug === "smartphone") {catName = "Điện thoại"}
    else if(catSlug === "laptop") {catName = "Laptop"}
    else if(catSlug === "tablet") {catName = "Máy tính bảng"}
    else if(catSlug === "watch") {catName = "Đồng hồ thông minh"}
    else  (catName = "Phụ kiện");
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageNum, setPageNum] = useState(0);

    useEffect(() => {
                 axios.post(`http://localhost:8000/api/category/getOneCategory?limit=10&page=0&sort=desc&sort=pname`, {
                    categoryName: catName
                 })
                     .then((response) => {
                         if (response.status === 200) {
                             setProductList(response.data.data);
                             setPageNum(response.data.totalPage);
                             console.log("CHECK RESPONSE data: ", response.data.data);
                             console.log("CHECK RESPONSE page_count: ", response.data.totalPage);
                         }
                     })
                     .catch((error) => {
                         if (error.response) {
                            //  alert(error.response.data.msg);
                         } else {
                             console.error('Error:', error.message);
                         }
                     })
    }, [])

    function handlePageClick(pageNum) {
        setCurrentPage(pageNum);
        const index = Number(pageNum);
        const offset = index*10;
        axios.get(`http://localhost/Assignment/Backend/api/product/category/${catID}/fetch/${offset}/10`)
        .then((response) => {
            if (response.status === 200) {
                setProductList(response.data.data.data);
                setPageNum(response.data.data.page_count);
                console.log("CHECK RESPONSE data: ", response.data.data.data);
                console.log("CHECK RESPONSE page_count: ", response.data.data.page_count);
            }
        })
        .catch((error) => {
            if (error.response) {
                // alert(error.response.data.msg);
            } else {
                console.error('Error:', error.message);
            }
        })
    }


    function hanldeSearch() {

    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow  mt-6">
                <div className="w-10/12 mx-auto h-10 justify-center">
                    <span><a href="customer/shopping">
                        Mua sắm
                    </a></span> /
                    <span>
                        <a href="customer/shopping" className="font-bold "> {catName === "smartphone" ? "Điện thoại" : null} </a>
                    </span>
                </div>

                <div className="bg-red-500">
                    fdsfasdfasdf
                    <div className="bg-blue-500" onClick={hanldeSearch} >Tìm kiếm</div>
                </div>

                <div className="w-10/12 mx-auto bg-product">
                    <div className="h-10"></div>
                    <div className="grid grid-cols-4 gap-y-10 ">
                        {productList.map((product, index) => (
                            <ProductCartSmall key={index} prodName={product.pname} prodPrice={product.price} prodID={product.product_id} prodRating={product.rating} />
                        ))}
                    </div>
                    <div className="h-10"></div>
                </div>


                <div className="flex justify-end w-10/12 mx-auto my-4">
                    {Array.from({ length: pageNum }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(i)} 
                            className={`px-3 py-1 mx-1 hover:bg-blue-300 ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                } rounded`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}