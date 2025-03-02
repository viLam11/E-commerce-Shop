import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ProductUpdate from "./ProductUpdate";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { format } from 'date-fns';

export default function OrdersManagement() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [productList, setProductList] = useState([]);

    const [orderList, setOrderList ] = useState([]);
    const [users, setUsers] = useState([]); 

    const [priceToggle, setPriceToggle] = useState(false);
    const [nameToggle, setNameToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [page, setPage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [token, setToken] = useState(null);
    const [count, setCount] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [cateName, setCateName] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [order, setOrder] = useState("asc");
    const [field, setField] = useState(null);
    const [prodDetail, setProDetail] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/category/getAll`)
            .then((response) => {
                console.log(response.data);
                setCateName(response.data.data);
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8000/api/order/getAllOrder?page=0&limit=10",)
            .then((response) => {
                console.log(response);
                const orders = response.data.data;
                const pageNum = response.data.totalPage;
                setPage(pageNum);
                setOrderList(orders);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })

    }, [count])


    function handlePageClick(pageNum) {
        const index = Number(pageNum);
        if (sorted) {
            axios.get(`http://localhost:8000/api/order/getAllOrder?page=${index}&limit=10&sort=${order}&sort=${field}`,)
            .then((response) => {
                console.log(response);
                setCurrentPage(pageNum)
                const orders = response.data.data;
                // console.log(JSON.stringify(orders));
                setOrderList(orders)
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })

        } 
        else {
            axios.get(`http://localhost:8000/api/order/getAllOrder?page=${index}&limit=10`,)
                .then((response) => {
                    console.log(response);
                    setCurrentPage(pageNum)
                    const products = response.data.data;
                    // console.log(JSON.stringify(products));
                    setOrderList(products);
                })
                .catch((error) => {
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        console.error('Error:', error.message);
                    }
                })
        }

    }


    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value != "-") {
            const [newField, newOrder] = value.split('-');
            setField(newField);
            setOrder(newOrder);

            axios.get(`http://localhost:8000/api/order/getAllOrder?page=0&limit=10&sort=${newOrder}&sort=${newField}`)
                .then((response) => {
                    const orderData = response.data.data;
                    console.log(orderData);
                    setCurrentPage(0);
                    setPage(response.data.totalPage);
                    setSorted(true);
                    setOrderList(orderData);
                })
                .then((error) => {
                    {
                        console.error('Error:', error);
                    }
                })
        } else {
            setField('');
            setOrder('');
            setSorted(false);   
        }
    };

    function hanldeAcceptOrder(orderID) {
        axios.put(`http://localhost:8000/api/order/UpdateOrder/${orderID}`, {
            "status": "Shipped"    
        })
            .then((response) => {
                console.log(response);
                setCount((prev) => prev+1);
            })
    }

    if (orderList.length > 0) {

        return (
            <div className="">
                <Header page="order-manage" role="admin" />

                <div className="m-4 mb-10">
                    <span className=" font-medium">Tất cả đơn hàng</span>
                </div>
                <main>

                    <table className="w-11/12 min-h-80 text-center text-bold  m-auto">
                        <thead>
                            <tr className="h-14 bg-purple-1 text-flborder rounded-e-sm">
                                <td className="w-1/12">Mã đơn</td>
                                <td className="w-2/12 text-left pr-4">
                                    Người đặt
                                    
                                </td>   
                                <td className="w-2/12">
                                    Tổng tiền
                                    <span>
                                        <select name="sortByName" id="sortName" className="bg-white border outline-none ml-4"
                                            value={field === "final_price" ? `${field}-${order}` : ""}
                                            onChange={handleSortChange}
                                        >
                                            <option value="" readOnly onClick={() => setCount((prev) => prev++)}></option>
                                            <option value="final_price-asc">Tăng</option>
                                            <option value="final_price-desc">Giảm</option>
                                        </select>
                                    </span>
                                </td>
                                <td className="w-2/12 text-left pl-6">Ngày tạo đơn
                                <span>
                                        <select name="sortByName" id="sortName" className="bg-white border outline-none ml-4"
                                            value={field === "create_time" ? `${field}-${order}` : ""}
                                            onChange={handleSortChange}
                                        >
                                            <option value="" readOnly onClick={() => setCount((prev) => prev++)}></option>
                                            <option value="create_time-asc">Tăng</option>
                                            <option value="create_time-desc">Giảm</option>
                                        </select>
                                    </span>
                                </td>

                                <td className="w-2/12 text-left pl-6">Ngày giao dự kiến
                                <span>
                                        <select name="sortByName" id="sortName" className="bg-white border outline-none ml-4"
                                            value={field === "estimated_delivery_time" ? `${field}-${order}` : ""}
                                            onChange={handleSortChange}
                                        >
                                            <option value="" readOnly onClick={() => setCount((prev) => prev++)}></option>
                                            <option value="estimated_delivery_time-asc">T</option>
                                            <option value="estimated_delivery_time-desc">G</option>
                                        </select>
                                    </span>
                                </td>
                                <td className="w-2/12">
                                    Đã xác nhận
                                </td>
                                <td className="w-2/12">Trạng thái</td>
                            </tr>
                        </thead>
                        <tbody>
                            {orderList.map((order, index) => {
           
                                return (
                                    <>
                                        <tr className="h-1 bg-white" ></tr>
                                        <tr className="h-14 bg-purple-2" key={index + 1}>
                                            <td>{order.oid}</td>
                                            <td className="text-left">{order.lname + " " + order.fname}</td>
                                            <td className="text-left">
                                                <span className="inline-block w-2/3 text-right p-4">{order.final_price.toLocaleString()}</span>
                                                VND
                                            </td>
                                            <td>
                                                 {format(new Date(order.create_time), 'dd/MM/yyyy')}
                                            </td>
                                            <td>
                                                 {format(new Date(order.estimated_delivery_time), 'dd/MM/yyyy')}
                                            </td>
                                            <td>
                                                {order.status !== "Shipped" ? <button className="border border-green-600 p-2 text-green-600 bg-green-50"
                                                    onClick={() => hanldeAcceptOrder(order.oid)} 
                                                >Accept</button> : "Yes" }
                                            </td>
                                            <td>
                                              {order.status}
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


            </div>
        )
    }

}