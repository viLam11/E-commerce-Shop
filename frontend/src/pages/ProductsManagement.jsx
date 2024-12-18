import Header from "../components/Header";
import Pagination from "../components/Pagination";

export default function ProductsManagement() {
    return (
        <>
            <Header />
            <main>
                <div className="p-4">
                    <span>Shop /</span>
                    <span>All Products</span>
                </div>

                <div className="w-full flex justify-center pt-14">
                    <table className="w-11/12 h-16 text-center text-bold text-xl">
                        <thead>
                            <tr className="h-14 bg-purple-1 border rounded-e-sm">
                                <td>Mã sản phẩm</td>
                                <td>Tên sản phẩm</td>
                                <td>Giá</td>
                                <td>Số lượng</td>
                                <td>Tùy chỉnh</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="h-10 bg-white"></tr>
                            <tr className="h-14 bg-purple-2">
                                <td>#11234</td>
                                <td>Ipad</td>
                                <td>10.999.000 VND</td>
                                <td>
                                    <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                    <input type="number" className="text-center w-full" />
                                    <div class="flex flex-col ml-1">
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                        </button>
                                    </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <div className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </div>
                                        <div className="w-2"></div>
                                        <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
                                            Xóa
                                        </div>
                                    </div>
                                </td>
                            </tr>


                            <tr className="h-10 bg-white"></tr>
                            <tr className="h-14 bg-purple-2">
                                <td>#11234</td>
                                <td>Ipad</td>
                                <td>10.999.000 VND</td>
                                <td>
                                    <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                    <input type="number" className="text-center w-full" />
                                    <div class="flex flex-col ml-1">
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                        </button>
                                    </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <div className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </div>
                                        <div className="w-2"></div>
                                        <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
                                            Xóa
                                        </div>
                                    </div>
                                </td>
                            </tr>


                            <tr className="h-10 bg-white"></tr>
                            <tr className="h-14 bg-purple-2">
                                <td>#11234</td>
                                <td>Ipad</td>
                                <td>10.999.000 VND</td>
                                <td>
                                    <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                    <input type="number" className="text-center w-full" />
                                    <div class="flex flex-col ml-1">
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                        </button>
                                    </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <div className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </div>
                                        <div className="w-2"></div>
                                        <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
                                            Xóa
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr className="h-10 bg-white"></tr>
                            <tr className="h-14 bg-purple-2">
                                <td>#11234</td>
                                <td>Ipad</td>
                                <td>10.999.000 VND</td>
                                <td>
                                    <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                    <input type="number" className="text-center w-full" />
                                    <div class="flex flex-col ml-1">
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                        </button>
                                    </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <div className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </div>
                                        <div className="w-2"></div>
                                        <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
                                            Xóa
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr className="h-10 bg-white"></tr>
                            <tr className="h-14 bg-purple-2">
                                <td>#11234</td>
                                <td>Ipad</td>
                                <td>10.999.000 VND</td>
                                <td>
                                    <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
                                    <input type="number" className="text-center w-full" />
                                    <div class="flex flex-col ml-1">
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
                                        </button>
                                    </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className="flex justify-center items-center">
                                        <div className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </div>
                                        <div className="w-2"></div>
                                        <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
                                            Xóa
                                        </div>
                                    </div>
                                </td>
                            </tr>



                          
                        </tbody>
                    </table>
                </div>

            </main> 
            <div className="float-right pt-8 block mr-20">
                <Pagination />
            </div>

            <footer className="h-32 bg-black mt-20 ">

            </footer>
        </>)
}