import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomerPie from "../components/CustomerPie";
import { useParams } from "react-router-dom";
import axios from "axios";



export default function TransactionHist() {
    const {id} = useParams();
    const [userDetail, setUserDetail] = useState({});
    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/get-detail/${id}`)
            .then((response) => {
                const detail = response.data.data;
                setUserDetail(detail);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }, [])

    return (
        <>
            <Header role="admin" page="user-manage" />

            <div className="m-4 mb-10 pl-6">
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
                                    Quận 9, TP.HCM
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
                                <td className="w-2/12">Mã sản phẩm</td>
                                <td className="w-4/12">Tên sản phẩm</td>
                                <td className="w-2/12">Giá</td>
                                <td className="w-2/12">Số lượng</td>
                                <td className="w-2/12"> Tùy chỉnh</td>
                            </tr>
                        </thead>
                        {/* <tbody>
                                    <>
                                        <tr className="h-10 bg-white" ></tr>
                                        <tr className="h-14 bg-purple-2">
                                            <td></td>
                                            <td className="text-left"></td>
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

                        </tbody> */}
                    </table>

                </div>

            </main>

            <Footer />
        </>
    )
}