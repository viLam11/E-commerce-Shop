import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export default function Checkout() {
    const {prodID} = useParams();
    console.log(prodID);

    useEffect(() => {
        
    }, [])

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <div className="w-11/12 m-auto">
                    <div className="my-4 ml-10">
                        <span className="text-gray-600">Cửa hàng / </span>
                        <span className="font-medium">Thanh toán</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-6 ml-10">Xác nhận đặt hàng</h1>
                    <div className="flex flex-row " >
                        <div className="col-1 w-1/2 text-sm">
                            <div className="w-10/12 ml-10">
                                <div className="mb-4 flex items-end w-full">
                                    

                                    <div className="w-full">
                                        <div>Họ tên</div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="lastName"
                                            className={`mt-1 p-2  w-4/5 bg-gray-100 text-gray-600 outline-none disabled`}
                                            value={"Huynh Bao Ngoc"}
                                            disabled
                                        />
                                    </div>

                                </div>
                                <div className="mb-4">
                                    <div>Email</div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`mt-1 p-2  w-4/5 bg-gray-100 text-gray-600 `}
                                        value={"ngoc@gmail.com"}
                                        disabled
                                    />

                                </div>

                                <div className="mb-4">
                                    <div>Số điện thoại</div>
                                    <input
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        className={`mt-1 p-2  w-4/5 bg-blue-50 hover:bg-blue-100`}
                                        value={"0942047249"}
                                    //   onChange={(e) => setPhone(e.target.value)}
                                    />

                                </div>

                                <div className="mb-4">
                                    <div>Địa chỉ</div>
                                    <input
                                        type="address"
                                        id="address"
                                        name="address"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={"sdfasdfadsfa"}
                                    //   onChange={(e) => setPass(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <div>Thêm ghi chú</div>
                                    <input
                                        type="note"
                                        id="note"
                                        name="note"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={"sdfasdfadsfa"}
                                    //   onChange={(e) => setPass(e.target.value)}
                                    />
                                </div>


                            </div>
                        </div>
                        <div className="col-2  w-1/2">
                            <div className="products w-8/12 space-y-4 m-auto">
                                <div className="flex flex-row items-center ">
                                    <div className=" w-2/5 flex items-center space-x-2">
                                        <span>
                                            <img src="https://th.bing.com/th/id/R.26fd47d8cd148081597eb4070ec6081f?rik=vKSdFuUdliHwaw&pid=ImgRaw&r=0" alt="" width={"50px"} />
                                        </span>
                                        <span>Iphone</span>
                                    </div>
                                    <div className=" w-2/5 text-right ">100.000.000 VND</div>
                                    <div className=" w-1/5 text-right mr-20">x 1</div>
                                </div>

                                <div className="flex flex-row items-center ">
                                    <div className=" w-2/5 flex items-center space-x-2">
                                        <span>
                                            <img src="https://th.bing.com/th/id/R.26fd47d8cd148081597eb4070ec6081f?rik=vKSdFuUdliHwaw&pid=ImgRaw&r=0" alt="" width={"50px"} />
                                        </span>
                                        <span>Iphone</span>
                                    </div>
                                    <div className=" w-2/5 text-right ">100.000.000 VND</div>
                                    <div className=" w-1/5 text-right mr-20">x 1</div>
                                </div>



                                <div className="flex justify-between mr-20">
                                    <div>Thành tiền</div>
                                    <div>100.000 VND</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Phí vận chuyển</div>
                                    <div>100.000 VND</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="promotion flex justify-between mr-20">
                                    <input type="text" placeholder="Nhập mã giảm giá" className="border border-black rounded-md p-2 w-3/5" />
                                    <button className="bg-red-600 text-white p-2 rounded-md">Áp dụng</button>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="flex justify-between mr-20">
                                    <div className="font-semibold">Tổng tiền</div>
                                    <div>100.000 VND</div>
                                </div>

                                <div className="payment-method">
                                    <label htmlFor="method" className="font-bold">Chọn phương thức thanh toán: </label>
                                    <div className="p-2 ml-2">
                                        <div className="space-x-2">
                                            <input type="radio" value="cash" name="payment" className="" />
                                            <span>Trả tiền khi nhận hàng</span>
                                        </div>
                                        <div className="space-x-2">
                                            <input type="radio" value="qr" name="payment" className="" />
                                            <span>Mã QR momo</span>
                                        </div>
                                       
                                    </div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-red-600 text-white font-bold p-2 rounded-md">Đặt hàng</div>
                                </div>
                            </div>

                            <div className="h-10"></div>
                            
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}