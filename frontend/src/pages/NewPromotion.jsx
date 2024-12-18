import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromotionInput from "../components/PromotionInput";

export default function NewPromotion() {
    const [promoType, setPromoType] = useState(null);


    function handleChangePromoType(type) {
        setPromoType(value);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header role="admin" />
            <main className="flex-grow">
                <div className="m-4 pl-20">
                    <span className="text-gray-600">Shop /</span>
                    <span className="font-medium">Add Promotion</span>
                </div>

                <h2 className="font-medium text-3xl pl-20 pt-10" >Thêm mã khuyến mãi mới </h2>
                <div className="grid grid-cols-2">
                    <div className="mx-auto w-4/5">
                        <div className="my-6">
                            <label>Tên khuyến mãi <span className="text-red-600">*</span></label>
                            <input type="text" name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md `}

                            />
                        </div>
                        <div className="my-6">
                            <label>Điều khoản và chính sách <span className="text-red-600">*</span></label>
                            <textarea width={100} name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-20 my-2 rounded-md `}>
                            </textarea>
                        </div>
                        <div className="my-">
                            <label>Số lượng <span className="text-red-600">*</span></label>
                            <input type="number" name="quanity" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}

                            />
                        </div>

                        <div className="my-">
                            <label>Thời gian hiệu lực <span className="text-red-600">*</span></label>
                            <input type="number" name="quanity" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}

                            />
                        </div>

                        <div className="my-">
                            <label>Chi tiêu tối thiểu <span className="text-red-600">*</span></label>
                            <input type="number" name="min-spent" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}

                            />
                        </div>




                    </div>

                    <div className="mx-auto w-4/5 ">
                        <div className="flex flex-col h-full">
                            <div>
                                <h2 className="font-bold">Mặt hàng áp dụng</h2>

                                <div className="my-6 ml-6">
                                    <label>Loại sản phẩm <span className="text-red-600">*</span></label>
                                    <select className="border border-black rounded-sm ml-6">
                                        <option value="null" disabled>Chọn loại sản phẩm</option>
                                        <option value="all">Tất cả</option>
                                        <option value="smartphone">Điện thoại</option>
                                        <option value="laptop">Laptop</option>
                                        <option value="watch">Đồng hồ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>

                                <div className="my-6 ml-6">
                                    <label htmlFor="">Loại khuyến mãi</label>
                                    <div className="grid grid-cols-2 ml-6 space-y-1">
                                        <div className="w-full">
                                            <input type="radio" value="percentage" className="mr-2" name="promo-type"
                                                onClick={() => setPromoType("percentage")}
                                            /> Giảm theo %

                                            <div>
                                                {promoType == "percentage" ? <PromotionInput name="percentage" /> : null}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <input type="radio" value="fixed" className="mr-2" name="promo-type"
                                                onClick={() => setPromoType("fixed")}
                                            /> Giảm số tiền cụ thể
                                            <div>
                                                {promoType == "fixed" ? <PromotionInput name="fixed" /> : null}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="my-6 ml-6 ">
                                    <label htmlFor="prodID" className="block mb-2">Mã sản phẩm &#40; nếu có, đặt cách nhau bởi dấu phẩy &#41; </label>
                                    <textarea name="prodIDs" className="w-2/3 h-10 bg-gray-100" ></textarea>
                                </div>
                            </div>

                            <div className="flex-grow"></div>

                            <div className="w-full flex justify-center ">
                                <button type="button" className="relative bg-red-600 p-2 font-bold rounded-md text-white block bottom-0">Xác nhận</button>
                           
                            </div>
                               </div>

                    </div>

                </div>



            </main>
            <div className="h-20"></div>
            <Footer />
        </div>

    )
}