import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ProductUpdate from "./ProductUpdate";
import { useNavigate } from "react-router-dom";

export default function ProductsManagement() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [productList, setProductList] = useState([]);
    const [priceToggle, setPriceToggle] = useState(false);
    const [nameToggle, setNameToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [page, setPage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [token, setToken] = useState(null);
    const [count, setCount] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [prodDetail, setProDetail] = useState(null);



    useEffect(() => {
        const loadToken = localStorage.getItem("token");
        if (loadToken) setToken(loadToken);
        axios.get("http://localhost:8000/api/product/getAll?page=0&limit=5",)
            .then((response) => {
                console.log(response);
                const products = response.data.data;
                const pageNum = response.data.totalPage;
                setPage(pageNum);
                // console.log(JSON.stringify(products));
                setProductList(products);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }, [count])


    function disableEditMode() {
        setEditMode(false);
    }

    function handleUpdateProduct(prodID) {
        navigate(`/admin/edit-product/${prodID}`);
    }

    function handlePageClick(pageNum) {
        const index = Number(pageNum);
        axios.get(`http://localhost:8000/api/product/getAll?page=${index}&limit=5`,)
            .then((response) => {
                console.log(response);
                setCurrentPage(pageNum)
                const products = response.data.data;
                // console.log(JSON.stringify(products));
                setProductList(products);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }

    function handleSearch() {
        alert("Search");
        if (keyword == null) {
            alert("Hãy điền từ khóa để tìm kiếm")
        }
        axios.get(`http://localhost:8000/api/product/getAll?page=0&limit=5&filter=${keyword}`,)
            .then((response) => {
                console.log(response);
                const products = response.data.data;
                const pageNum = response.data.totalPage;
                setPage(pageNum);
                // console.log(JSON.stringify(products));
                setProductList(products);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }

    function handleDeleteProduct(prodID) {
        // alert(prodID + token);
        axios.delete(`http://localhost:8000/api/product/DeleteProduct/${prodID}`, null, {
            headers: {
                Authorization: `Bearer ${token}`, // Replace <your-auth-token> with the actual token
            },
        })
            .then((response) => {
                alert(response.data.msg);
                setCount((pre) => pre + 1);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })

    }

    if (productList.length > 0) {

        return (
            <>
                <Header page="product-manage" role="admin" />

                <div className="m-4 mb-10">
                    <span className=" font-medium">All Products</span>
                </div>
                <main>

                    <div className="flex">
                        <div className="flex items-center w-1/4 mb-10 m-auto border border-black rounded-md p-1">
                            <input
                                type="text"
                                className="flex-grow p-2 rounded-md outline-none"
                                placeholder="Find product ?"
                                onChange={(e) => {
                                    setKeyword(e.target.value)
                                }}
                            />
                            <div className="p-2 bg-gray-300" onClick={handleSearch} >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-500 font-bold hover:text-black "

                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>
                            </div>

                        </div>
                        <div className="add-product inline-block bg-gray-300 h-full relative right-20 p-2 hover:bg-slate-200" onClick={() => {navigate("/admin/product-new")}}>
                            <div className="font-bold ">Thêm sản phẩm</div>
                        </div>

                    </div>

                    {editMode && (
                        <>
                            <ProductUpdate disableEditMode={disableEditMode} />
                            <div className="fixed inset-0 bg-black bg-opacity-30 z-10"></div>
                        </>
                    )}
                    <table className="w-11/12 min-h-80 text-center text-bold text-xl m-auto">
                        <thead>
                            <tr className="h-14 bg-purple-1 border rounded-e-sm">
                                <td className="w-2/12">Mã sản phẩm</td>
                                <td className="w-4/12">Tên sản phẩm</td>
                                <td className="w-2/12">Giá</td>
                                <td className="w-2/12">Số lượng</td>
                                <td className="w-2/12"> Tùy chỉnh</td>
                            </tr>
                        </thead>
                        <tbody>

                            {productList.map((prod) => {
                                return (
                                    <>
                                        <tr className="h-10 bg-white" ></tr>
                                        <tr className="h-14 bg-purple-2" key={prod.product_id}>
                                            <td>{prod.product_id}</td>
                                            <td className="text-left">{prod.pname}</td>
                                            <td className="text-left">
                                                <span className="inline-block w-2/3 text-right p-4">{prod.price.toLocaleString()}</span>
                                                 VND
                                            </td>
                                            <td>
                                                <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                                    <input type="number" className="text-center w-full" value={prod.quantity} onChange={() => { }} />
                                                    <div className="flex flex-col ml-1">
                                                        <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex justify-center items-center">
                                                    <button onClick={() => handleUpdateProduct(prod.product_id)} className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                                        Sửa
                                                    </button>
                                                    <div className="w-2"></div>
                                                    <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase " onClick={() => handleDeleteProduct(prod.product_id)} >
                                                        Xóa
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </>

                                );
                            })}

                        </tbody>
                    </table>

                    <div className="h-10">

                    </div>

                    <div className="flex justify-end mr-20">
                        {/* <Pagination /> */}
                        {Array.from({ length: page }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageClick(i)} // Pass the page number to the handler
                                className={`px-3 py-1 mx-1 hover:bg-blue-300 ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                    } rounded`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="h-10">

                    </div>


                    <div>
                        <Footer />
                    </div>
                </main>


            </>
        )
    }

}