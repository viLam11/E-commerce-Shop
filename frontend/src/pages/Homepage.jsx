import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductsManagement from "./ProductsManagement";
import ProductCard from "../components/ProductCard";
import CatogoryCard from "../components/CategoryCard";

export default function Homepage() {
    const [role, setRole] = useState("customer");
    const [token, setToken] = useState(null);

    // useEffect(() => {
    //     const loadRole = localStorage.getItem("role");
    //     const loadToken = localStorage.getItem("token");
    //     if (loadRole) {
    //         setRole(loadRole)
    //     }
    //     if (loadToken) {
    //         setToken(loadToken)
    //     }
    // })

    {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />


                <main className="flex-grow">
                    <div class="grid grid-cols-[20vw_80vw] mt-2 w-10/12 mx-auto">
                        <div className="flex items-center">
                            <ul className="w-3/4 font-semibold space-y-6 my-auto pr-6 border-r-2 border-gray-200 ">
                                <li className="border-b-2 border-black ">Điện thoại</li>
                                <li className="border-b-2 border-black ">Laptop</li>
                                <li className="border-b-2 border-black ">Máy tính bảng</li>
                                <li className="border-b-2 border-black ">Đồng hồ thông minh</li>
                                <li className="border-b-2 border-black ">Phụ kiện</li>
                            </ul>

                        </div>
                        <div className="">
                            <img src="../../public/banner1.jpg" alt="" width="900px" h="400px" />
                        </div>
                    </div>

                    <div className="h-20"></div>

                    <div className=" w-10/12 mx-auto bg-product">
                        <div className="font-bold text-red-400 flex flex-row items-center ">
                            <span className="w-4 h-8 bg-red-500 inline-block"></span>
                            <span className="px-4">Sản phẩm nổi bật</span>
                        </div>
                        <div className="grid grid-cols-4 gap-6 py-6 w-full">
                            {Array.from({ length: 4 }, (_, i) => (
                                <ProductCard  prodName={"Tên sản phẩm"} prodID={"prod001"} prodImage={""} prodRating={"4"} prodPrice={"2000"} />
                            ))}
                        </div>
                    </div>

                    <div className="h-10"></div>
                    <div className="flex justify-center items-center">
                        <div className="text-white bg-red-500 p-2 rounded-md">Xem tất cả sản phẩm</div>
                    </div>



                    {/* PHẦN DANH MỤC */}

                    <div className=" w-10/12 mx-auto bg-product mt-10">
                        <div className="font-bold text-red-400 flex flex-row items-center ">
                            <span className="w-4 h-8 bg-red-500 inline-block"></span>
                            <span className="px-4">Danh mục</span>
                        </div>
                        {/* <div className="grid grid-cols-6 gap-6 py-6 ">
                            {Array.from({ length: 6 }, (_, i) => (
                                <CatogoryCard catName="Điện thoại" />
                            ))}
                        </div> */}

                        <div className="">
                            <div className="flex flex-row  justify-between w-11/12 m-auto">
                                <a className="category-type" href="#" onClick={(e) => { e.preventDefault(); ViewCategories('c01') }}>
                                    <div className="bg-white flex flex-col justify-center items-center w-48 h-48 rounded-lg">
                                        <img src="../../public/img/s-l960 (1).webp" alt='Phone' className="w-auto h-36"  />
                                    </div>
                                    <div className="text-center font-bold text-lg py-2">Điện thoại</div>
                                </a>
                                <a className="category-type" href="#" onClick={(e) => { e.preventDefault(); ViewCategories('c04') }}>
                                    <div className="bg-white flex flex-col justify-center items-center w-48 h-48 rounded-lg">
                                        <img src="../../public/img/s-l960.webp"  className="w-40" style={{ marginBottom: '12px' }} />
                                    </div>
                                    <div className="text-center font-bold text-lg py-2">Đồng hồ</div>
                                </a>
                                <a className="category-type" href="#" onClick={(e) => { e.preventDefault(); ViewCategories('c02') }}>
                                    <div className="bg-white flex flex-col justify-center items-center w-48 h-48 rounded-lg">
                                        <img src="../../public/img/s-l960 (2).webp"  className="w-40" style={{ marginBottom: '23px', marginTop: '15px' }} />
                                    </div>
                                    <div className="text-center font-bold text-lg py-2">Laptop</div>
                                </a>
                                <a className="category-type" href="#" onClick={(e) => { e.preventDefault(); ViewCategories('c03') }}>
                                    <div className="bg-white flex flex-col justify-center items-center w-48 h-48 rounded-lg">
                                        <img src="../../public/img/s-l960 (3).webp"  className="w-48" />
                                    </div>
                                    <div className="text-center font-bold text-lg py-2">Máy tính bảng</div>
                                </a>
                                <a className="category-type" href="#" onClick={(e) => { e.preventDefault(); ViewCategories('c05') }}>
                                    <div className="bg-white flex flex-col justify-center items-center w-48 h-48 rounded-lg">
                                        <img src="../../public/img/mobile-phone-accessories-for-sell-e-commerce-portal.jpg"  className="w-40" style={{ marginBottom: '16px', marginTop: '8px' }} />
                                    </div>
                                    <div className="text-center font-bold text-lg py-2">Phụ kiện</div>
                                </a>
                            </div>
                        </div>
                    </div>




                    <div className="h-60"></div>
                </main>

                <div>
                    <Footer />
                </div>

            </div>
        )
    }

}