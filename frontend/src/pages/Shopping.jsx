import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCartSmall from "../components/ProductCardSmall";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Shopping() {    
    const [smartphoneList, setSmartphoneList] = useState([]);
    const [laptopList, setLaptopList] = useState([]);
    const [tabletList, setTabletList] = useState([]);  
    const [watchList, setWatchList] = useState([]);
    const [otherList, setOtherList] = useState([]); 
    
    useState(() => {    
        const fetchData = async () => {
            try { 
                const fetchSmartphone = axios.get(`http://localhost/Assignment/Backend/api/product/category/1/fetch/0/4`);
                const fetchLaptop = axios.get(`http://localhost/Assignment/Backend/api/product/category/2/fetch/0/4`);
                const fetchTablet = axios.get(`http://localhost/Assignment/Backend/api/product/category/3/fetch/0/4`);  
                const fetchWatch = axios.get(`http://localhost/Assignment/Backend/api/product/category/4/fetch/0/4`);
                const fetchOther = axios.get(`http://localhost/Assignment/Backend/api/product/category/5/fetch/0/4`);   

                const [smartphoneResponse, laptopResponse, tabletResponse, watchResponse, otherResponse] = await Promise.all([fetchSmartphone, fetchLaptop, fetchTablet, fetchWatch, fetchOther]);

                if(smartphoneResponse.status === 200) {
                    const smartphoneData = smartphoneResponse.data.data.data;
                    setSmartphoneList(smartphoneData);
                }

                if(laptopResponse.status === 200) {
                    const laptopData = laptopResponse.data.data.data;
                    setLaptopList(laptopData);
                }
                
                if(tabletResponse.status === 200) {
                    const tabletData = tabletResponse.data.data.data;
                    setTabletList(tabletData);
                }   

                if(watchResponse.status === 200) {
                    const watchData = watchResponse.data.data.data;
                    setWatchList(watchData);
                }

                if(otherResponse.status === 200) {
                    const otherData = otherResponse.data.data.data;
                    setOtherList(otherData);
                }   
               
            }
            catch(error) {

            }
        }
       
        fetchData();
    }, [])

    return (
        <div className="flex flex-col min-h-screen">
            <Header />


            <main className="flex-grow mt-4">
                <div className="w-10/12 mx-auto">
                    <span>
                        <a href="customer/shopping" className="font-bold ">Mua sắm {"/"} </a>
                    </span>
                </div>
                <div className=" w-10/12 mx-auto">

                    <div className="w-full bg-product mt-10">
                        <div className="flex justify-between">
                            <div className="justify-center items-center">
                                <span className="w-4 h-8 bg-red-500 inline-block"></span>
                                <span className="px-4 text-red-500 font-bold ">Điện thoại</span>
                            </div>
                            <div>
                                <button className=" bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-700 "
                                    onClick={() => window.location.href = (`/customer/category/smartphone`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { smartphoneList.length > 0 && smartphoneList.map((prod, index) => (
                                <ProductCard prodID={prod.id} prodName={prod.name} prodPrice={prod.price} prodRating={prod.avg_rating} prodImage={prod.image[0].url} />
                            ))}
                        </div>
                    </div>

                    <div className="w-full bg-product mt-10">
                        <div className="flex justify-between">
                            <div className="justify-center items-center">
                                <span className="w-4 h-8 bg-red-500 inline-block"></span>
                                <span className="px-4 text-red-500 font-bold ">Laptop</span>
                            </div>
                            <div>
                                <button className=" bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-700 "
                                    onClick={() => window.location.href = (`/customer/category/laptop`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { laptopList.length > 0 && laptopList.map((prod, index) => (
                                <ProductCard prodID={prod.id} prodName={prod.name} prodPrice={prod.price} prodRating={prod.avg_rating} prodImage={prod.image[0].url} />
                            ))}
                        </div>
                    </div>

                    <div className="w-full bg-product mt-10">
                        <div className="flex justify-between">
                            <div className="justify-center items-center">
                                <span className="w-4 h-8 bg-red-500 inline-block"></span>
                                <span className="px-4 text-red-500 font-bold ">Máy tính bảng</span>
                            </div>
                            <div>
                                <button className=" bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-700 "
                                    onClick={() => window.location.href = (`/customer/category/tablet`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { tabletList.length > 0 && tabletList.map((prod, index) => (
                                <ProductCard prodID={prod.id} prodName={prod.name} prodPrice={prod.price} prodRating={prod.avg_rating} prodImage={prod.image[0].url} />
                            ))}
                        </div>
                    </div>

                    <div className="w-full bg-product mt-10">
                        <div className="flex justify-between">
                            <div className="justify-center items-center">
                                <span className="w-4 h-8 bg-red-500 inline-block"></span>
                                <span className="px-4 text-red-500 font-bold ">Đồng hồ thông minh</span>
                            </div>
                            <div>
                                <button className=" bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-700 "
                                    onClick={() => window.location.href = (`/customer/category/watch`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { watchList.length > 0 && watchList.map((prod, index) => (
                                <ProductCard prodID={prod.id} prodName={prod.name} prodPrice={prod.price} prodRating={prod.avg_rating} prodImage={prod.image[0].url} />
                            ))}
                        </div>
                    </div>

                    <div className="w-full bg-product mt-10">
                        <div className="flex justify-between">
                            <div className="justify-center items-center">
                                <span className="w-4 h-8 bg-red-500 inline-block"></span>
                                <span className="px-4 text-red-500 font-bold ">Phụ kiện</span>
                            </div>
                            <div>
                                <button className=" bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-700 "
                                    onClick={() => window.location.href = (`/customer/category/other`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { otherList.length > 0 && otherList.map((prod, index) => (
                                <ProductCard prodID={prod.id} prodName={prod.name} prodPrice={prod.price} prodRating={prod.avg_rating} prodImage={prod.image[0].url} />
                            ))}
                        </div>
                    </div>


                </div>


            </main>
            <div className="h-10"></div>
            <Footer />

        </div>
    )
}