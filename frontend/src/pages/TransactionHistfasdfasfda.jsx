import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomerPie from "../components/CustomerPie";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TransactionHist() {
    const { userID } = useParams();
    const [userDetail, setUserDetail] = useState({});
    const [orderList, setOrderList] = useState([]);
    const [totalPayment, setTotalPayment] = useState(0);

    // PAGINATION
    const [page, setTotalPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    function handlePageClick(pageNum) {
        const index = Number(pageNum);

    }


    useEffect(() => {
        const fetchData = async () => {
            try {

                const user_id = localStorage.getItem("userID");
                const fetchUserData = axios.get(`http://localhost:8000/api/user/get-detail/${userID}`);
                const fetchHistoryData = axios.get(`http://localhost:8000/api/order/getAllOrder/${userID}?limit=5&page=0&sort=desc&sort=estimated_delivery_time`);

                const [userDataResponse, historyDataResponse] = await Promise.all([fetchUserData, fetchHistoryData]);

                if (userDataResponse.status === 200) {
                    console.log("Check user data: ", userDataResponse.data.data)

                    setUserDetail(userDataResponse.data.data);
                }

                if (historyDataResponse.status === 200) {
                    console.log("Check history data: ", historyDataResponse.data.data)
                    const historyData = historyDataResponse.data.data;
                    setTotalPayment(historyData.sum_orders_price);
                    setTotalPage(historyData.page_count);
                    setOrderList(historyData.data);
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

    return (
        <>
            <Header />

            <div className="m-4 mb-10 pl-6">
                <span className="text-grey-500">Cá nhân / </span>
                <span className=" font-medium">Lịch sử mua hàng</span>
            </div>
            <main className="min-h-screen">
                <div className="info grid grid-cols-2">
                    <div className="col-1 ">
                        <div className="w-1/2 bg-white ml-20 space-y-2">
                            <div className="space-y-1">
                                <label htmlFor="name">Tên</label>
                                <div className="pl-2 bg-gray-100 rounded-ms p-1 text-gray-600">
                                    {userDetail.name}
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
                                    {userDetail.address}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-1">
                        <div className="w-3/5 bg-purple-2 h-40 rounded-lg flex flex-row  items-center justify-between">
                            <div className="sta space-y-1 p-4 ">
                                <div className="font-semibold italic">Tổng chi tiêu</div>
                                <div className="font-bold text-2xl">
                                    {new Intl.NumberFormat('vi-VN').format(totalPayment)} VND
                                </div>

                            </div>
                            <div className="graph pr-4">
                                <CustomerPie />
                            </div>

                        </div>
                    </div>
                </div>


                <div className="text-2xl font-bold py-10 pl-10">Lịch sử mua hàng</div>

                <div style={{"height": "345px"}}>
                    <table className="w-11/12 text-center text-bold text-xl m-auto" >
                        <thead>
                            <tr className="h-14 bg-purple-1 border rounded-e-sm text-l">
                                <td className="w-1/12">STT</td>
                                <td className="w-1/12">Mã sản phẩm</td>
                                <td className="w-2/12">Tên sản phẩm</td>
                                <td className="w-1/12">Giá</td>
                                <td className="w-1/12">Số lượng</td>
                                <td className="w-1/12">Thành tiền</td>
                                <td className="w-2/12">Thời gian</td>
                                <td className="w-1/12">Trạng thái</td>
                            </tr>
                        </thead>
                        <tbody>
                             {Array.isArray(orderList) &&  orderList.length > 0 &&  orderList.map((order, index) => (
                                 <tr className="h-14  border rounded-e-sm text-l">
                                    <td className="w-1/12">{index+1}</td>
                                    <td className="w-1/12">{order.products[0].product_id}</td>
                                    <td className="w-2/12">{order.products[0].product_name}</td>
                                    <td className="w-1/12">{order.products[0].buy_price}</td>
                                    <td className="w-1/12">{order.products[0].buy_quantity}</td>
                                    <td className="w-1/12">{order.products[0].subtotal_price}</td>
                                    <td className="w-2/12">{order.creation_date}</td>
                                    <td className="w-1/12">{order.status}</td>
                                </tr>
                                
                            ))}

                        </tbody>
                    </table>
                    <div className="h-16 flex flex-end justify-end items-end">
                        <div className="mb-4 mr-10">
                            <div className="flex justify-end mr-10">
                                {/* <Pagination /> */}
                                {Array.from({ length: page}, (_, i) => (
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
                        </div>
                    </div>
                </div>

            </main>
            <div className="h-20"></div>
            <Footer />
        </>
    )
}