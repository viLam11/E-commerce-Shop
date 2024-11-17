import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ProductUpdate from "./ProductUpdate";

export default function ProductsManagement() {
    const [editMode, setEditMode] = useState(false);
    const [productList, setProductList] = useState([]);
    const [erros, setErros] = useState(null);
    const [priceToggle, setPriceToggle] = useState(false);
    const [nameToggle, setNameToggle] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8000/api/product/getAll",)
            .then((response) => {
                console.log(response);
                const products = response.data.data;
                console.log(JSON.stringify(products));
                setProductList(products);
            })
    })


    function disableEditMode() {
        setEditMode(false);
    }

    // if (productList.length > 0) {

    //     return (
    //         <>
    //                <Header page="homepage" />

    //                <div className="p-4">
    //                 <span>Shop /</span>
    //                 <span>All Products</span>
    //             </div>
    //         <main>

    //             {editMode && (
    //             <>
    //                 <ProductUpdate disableEditMode={disableEditMode} />
    //                 <div className="fixed inset-0 bg-black bg-opacity-30 z-10"></div>
    //             </>
    //         )}
    //             <table className="w-11/12 h-16 text-center text-bold text-xl m-auto">
    //                 <thead>
    //                     <tr className="h-14 bg-purple-1 border rounded-e-sm">
    //                         <td>Mã sản phẩm</td>
    //                         <td>Tên sản phẩm</td>
    //                         <td>Giá</td>
    //                         <td>Số lượng</td>
    //                         <td>Tùy chỉnh</td>
    //                     </tr>
    //                 </thead>
    //                 <tbody>

    //                     {productList.map((prod) => {
    //                         return (
    //                             <>
    //                                 <tr className="h-10 bg-white"></tr>
    //                                 <tr className="h-14 bg-purple-2" key={prod.product_id}>
    //                                     <td>{prod.product_id}</td>  
    //                                     <td>{prod.pname}</td>       
    //                                     <td>{prod.price.toLocaleString()} VND</td> 
    //                                     <td>
    //                                         <div className="bg-white flex border w-20 border-black border-solid rounded-sm text-center m-auto">
    //                                             <input type="number" className="text-center w-full" value={prod.quantity} />
    //                                             <div className="flex flex-col ml-1">
    //                                                 <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
    //                                                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
    //                                                 </button>
    //                                                 <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
    //                                                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 10l-5 5-5-5h10z" /></svg>
    //                                                 </button>
    //                                             </div>
    //                                         </div>
    //                                     </td>
    //                                     <td>
    //                                         <div className="flex justify-center items-center">
    //                                             <button onClick={(e) => setEditMode(true)} className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
    //                                                 Sửa
    //                                             </button>
    //                                             <div className="w-2"></div>
    //                                             <div className="bg-red-600 px-4 rounded-md font-bold text-white uppercase ">
    //                                                 Xóa
    //                                             </div>
    //                                         </div>
    //                                     </td>
    //                                 </tr>
    //                             </>

    //                         );
    //                     })}

    //                 </tbody>
    //             </table>
    //         </main>


    //         </>
    //     )
    // }


    return (
        <>
            <Header role="admin" />

            {editMode && (
                <>
                    <ProductUpdate disableEditMode={disableEditMode} />
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-10"></div>
                </>
            )}

            <main >
                <div className="mx-10 mt-10">
                    <span>Shop /</span>
                    <span>All Products</span>
                </div>

                <div className="flex items-center w-1/4 my-10 m-auto border border-black rounded-md p-1">
                    <input
                        type="text"
                        className="flex-grow p-2 rounded-md outline-none"
                        placeholder="Find product ?"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 font-bold hover:text-black "

                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                </div>


                <div className="w-full flex justify-center ">
                    <table className="w-11/12 h-16 text-center text-bold text-xl">
                        <thead>
                            <tr className="h-14 bg-purple-1 border rounded-e-sm">
                                <td>Mã sản phẩm</td>
                                <td className="relative  p-2">
                                    <span onClick={() => { setNameToggle((prev) => !prev); }} className="cursor-pointer">
                                        Tên sản phẩm
                                    </span>
                                    <div className={`absolute  left-24  top-13 w-40 bg-purple-1 border-collapse  shadow-lg z-40 ${nameToggle ? 'block' : 'hidden'}`}>
                                        <ul className="">
                                            <li className=" hover:bg-purple-100 cursor-pointer border-b border-black">Increasing</li>
                                            <li className=" hover:bg-purple-100 cursor-pointer border-b border-black">Decreasing</li>
                                        </ul>
                                    </div>
                                </td>

                                <td className="relative  p-2">
                                    <span onClick={() => { setPriceToggle((prev) => !prev); }} className="cursor-pointer">
                                        Giá
                                    </span>
                                    <div className={`absolute left-24 top-13 w-40 bg-purple-1 border-collapse  shadow-lg z-40 ${priceToggle ? 'block' : 'hidden'}`}>
                                        <ul className="">
                                            <li className=" hover:bg-purple-100 cursor-pointer border-b border-black">Increasing</li>
                                            <li className=" hover:bg-purple-100 cursor-pointer border-b border-black">Decreasing</li>
                                        </ul>
                                    </div>
                                </td>

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
                                        <button onClick={(e) => setEditMode(true)} className="bg-green-600 px-4 rounded-md font-bold text-white uppercase">
                                            Sửa
                                        </button>
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

                <div className="h-10">

                </div>

                <div className="flex justify-end mr-20">
                    <Pagination />
                </div>

                <div className="h-10">

                </div>


                <div>
                    <Footer />
                </div>
            </main>



        </>)
}