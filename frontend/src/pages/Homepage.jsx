import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Homepage() {

    return (
        <>
            <Header />


            <main className="w-screen">
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

                <div className="h-80 w-10/12 mx-auto bg-product">
                    <div className="font-bold text-red-400 flex flex-row items-center ">
                        <span className="w-4 h-8 bg-red-500 inline-block"></span>
                        <span className="px-4">Sản phẩm nổi bật</span>
                    </div>

                    <div className="flex flex-row space-x-20 pt-6 px-6 justify-center">
                        <div className="w-56 h-56 border bg-white flex justify-center align-center">
                            <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" />
                        </div>

                        <div className="w-56 h-56 border bg-white flex justify-center align-center">
                            <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" />
                        </div>

                        <div className="w-56 h-56 border bg-white flex justify-center align-center">
                            <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" />
                        </div>

                        <div className="w-56 h-56 border bg-white flex justify-center align-center">
                            <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" />
                        </div>

                    </div>

                </div>


                <div className="h-60"></div>
            </main>

            <div>
                <Footer />
            </div>

        </>
    )
}