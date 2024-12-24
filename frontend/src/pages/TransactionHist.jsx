import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomerPie from "../components/CustomerPie";
import OrderDetail from "../components/OrderDetail";
import Modal from "../components/Modal"; // Import the Modal component

import { useParams } from "react-router-dom";
import axios from "axios";



export default function TransactionHist() {
    const [currentPage, setCurrentPage] = useState(0);
    const [page, setPage] = useState(0);
    const { userID } = useParams();
    const [userDetail, setUserDetail] = useState({});
    const [address, setAddress] = useState([]); 
    const [orderList, setOrderList] = useState([]);
    const [detailMode, setDetailMode] = useState(false);
    const [orderID, setOrderID] = useState(null);
    const [shippingFee, setShippingFee] = useState(0);  
    const [finalPrice, setFinalPrice] = useState(0);    
    const [totalPrice, setTotalPrice] = useState(0);
    const [productList, setProductList] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store selected order details

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUserData = axios.get(`http://localhost:8000/api/user/get-detail/${userID}`);
                const fetchHistoryData = axios.get(`http://localhost:8000/api/order/getAllOrderbyUser/${userID}?limit=10&page=0&sort=desc&sort=estimated_delivery_time`);
                const fetchAddressData = axios.get(`http://localhost:8000/api/user/GetAll/${userID}`); 
                const [userDataResponse, historyDataResponse, addressDataResponse] = await Promise.all([fetchUserData, fetchHistoryData, fetchAddressData]);

                if (userDataResponse.status == 200) {
                    console.log("Check user data: ", userDataResponse.data.data);
                    setUserDetail(userDataResponse.data.data);  
                }

                if (addressDataResponse.status == 200) {
                    console.log("Check address data: ", addressDataResponse.data.data);
                    setAddress(addressDataResponse.data.data);  
                }   

                if (historyDataResponse.status == 200) {
                    console.log("Check history data: ", historyDataResponse.data);
                    const historyData = historyDataResponse.data.data;
                    console.log("Check history data: ", historyData);
                    setOrderList(historyData);
                }
            }
            catch (error) {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            }

        }
        fetchData();
    }, [])

    function handleViewDetail(order_id, final_price, total_price) {
        axios.get(`http://localhost:8000/api/order/getDetailOrder/${order_id}`)
        .then((response) => {
            const prodData = response.data.data;
            console.log("CHECK DATA: ", prodData);
            setProductList(prodData);
        })
        setTotalPrice(total_price);
        setFinalPrice(final_price);
        setDetailMode(true);
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

    return (
        <>
            {detailMode && <OrderDetail productList={productList} orderID={""} setDetailMode={setDetailMode} shippingFee={shippingFee} totalPrice={totalPrice} finalPrice={finalPrice} />}
            <div className={detailMode ? "" : "" }>
                <Header role="admin" page="user-manage" />

                <div className="m-4 mb-10 pl-6 ">
                    <span className="text-grey-500">User / </span>
                    <span className=" font-medium">Transaction History</span>
                </div>

                <main className="min-h-screen">
                    <div className="info grid grid-cols-2">
                        <div className="col-1 ">
                            <div className="w-1/2 bg-white ml-20 space-y-2">
                                <div className="space-y-1">
                                    <label htmlFor="name">Tên</label>
                                    <div className="pl-2 bg-gray-100 rounded-ms p-1 text-gray-600">
                                        {userDetail.lname + " " + userDetail.fname}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="name">Email</label>
                                    <div className="pl-2 bg-gray-100 rounded-ms p-1 text-gray-600">
                                        {userDetail.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="name">Địa chỉ</label>
                                    <div className="pl-2 bg-gray-100 rounded-ms p-1 text-gray-600">
                                        {Array.isArray(address) && address.length > 0 ? address[0].address : "Không"}  
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="col-1">
                            <div className="w-3/5 bg-purple-2 h-40 rounded-lg flex flex-row  items-center justify-between">
                                <div className="sta space-y-1 p-4 ">
                                    <div>Tổng chi tiêu</div>
                                    <div className="font-bold text-2xl">
                                        {new Intl.NumberFormat('vi-VN').format(userDetail.total_payment)}
                                    </div>
                                    <div className="text-gray-700">12 sản phẩm</div>
                                    <div className="text-gray-700">Thẻ thành viên: {userDetail.ranking}</div>
                                </div>
                                <div className="graph pr-4">
                                    <CustomerPie />
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="text-2xl font-bold py-10 pl-10">Lịch sử mua hàng</div>

                    <div>
                        <table className="w-11/12 text-center text-bold text-xl m-auto">
                            <thead>
                                <tr className="h-14 bg-purple-1 border rounded-e-sm">
                                    <td className="w-1/12 border border-black">STT</td>
                                    <td className="w-2/12 border border-black">Mã sản phẩm</td>
                                    <td className="w-2/12 border border-black">Tổng tiền</td>
                                    <td className="w-2/12 border border-black">Ngày mua</td>
                                    <td className="w-2/12 border border-black">Ngày giao hàng</td>
                                    <td className="w-2/12 border border-black">Trạng thái</td>
                                    <td className="w-2/12 border border-black">Thông tin</td>
                                </tr>
                            </thead>
                            <tbody className="text-md">
                                {orderList.length > 0 && orderList.map((order, index) => (
                                    <tr className="h-14  border rounded-e-sm text-l border-black">
                                        <td className="w-1/12 border border-black">{index + 1}</td>
                                        <td className="w-2/12 border border-black">{order.oid}</td>
                                        <td className="w-2/12 border border-black">{order.total_price}</td>
                                        <td className="w-2/12 border border-black">{formatTimestamp(order.create_time)}</td>
                                        <td className="w-2/12 border border-black">{formatTimestamp(order.create_time)}</td>
                                        <td className="w-2/12 border border-black">{order.status}</td>
                                        <td className="w-2/12 border border-black">
                                            <div className="bg-green-600 text-white font-bold w-20 mx-auto p-1 hover:bg-green-500"
                                                onClick={() => handleViewDetail(order.oid, order.final_price, order.total_price)}
                                            >Chi tiết</div>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>

                    </div>

                    <div className="flex justify-end mr-20 mt-10">
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

                    <div className="h-10">  </div>


                </main>

                <Footer />
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>Order Details</h2>
                    <p>Order ID: {selectedOrder.oid}</p>
                    <p>Total Price: {selectedOrder.total_price}</p>
                    <p>Shipping Fee: {selectedOrder.shipping_fee}</p>
                    <p>Final Price: {selectedOrder.final_price}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <p>Order Date: {formatTimestamp(selectedOrder.create_time)}</p>
                    <p>Delivery Date: {formatTimestamp(selectedOrder.estimated_delivery_time)}</p>
                </Modal>
            )}
        </>
    )
}