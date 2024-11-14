import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Homepage() {

    return (
        <>
            <Header />


            <main className="w-screen">
                <div class="grid grid-cols-[30vw_70vw] mt-2">
                    <div className="">
                        <ul className="w-1/2 mx-auto font-semibold space-y-2 my-auto pr-6 border-r-2 border-gray-200">
                            <li className="border-b-2 border-black ">Điện thoại</li>
                            <li  className="border-b-2 border-black ">Laptop</li>
                            <li  className="border-b-2 border-black ">Máy tính bảng</li>
                            <li  className="border-b-2 border-black ">Đồng hồ thông minh</li>
                            <li className="border-b-2 border-black ">Phụ kiện</li>
                        </ul>

                    </div>
                    <div class="bg-green-500">
                        <img src="" alt="" />

                    </div>
                </div>

            </main>

            <Footer />
        </>
    )
}