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
    
    // useEffect(() => {    
    //     const fetchData = async () => {
    //         try { 
    //             alert("HII")
    //             const fetchSmartphone = axios.post(`http://localhost:8000/api/category/getOneCategory`, {
    //                                     "categoryName": "Điện thoại"
    //                                 });
    //             // const fetchLaptop = axios.post(`http://localhost:8000/api/category/getOneCategory?limit=4&page=0`, {
    //             //                         "categoryName": "Điện thoại"
    //             //                     });
    //             // const fetchTablet = axios.post(`http://localhost:8000/api/category/getOneCategory?limit=4&page=0`, {
    //             //                         "categoryName": "Điện thoại"
    //             //                     });
    //             // const fetchWatch = axios.post(`http://localhost:8000/api/category/getOneCategory?limit=4&page=0`, {
    //             //                         "categoryName": "Điện thoại"
    //             //                     });
    //             // const fetchOther = axios.post(`http://localhost:8000/api/category/getOneCategory?limit=4&page=0`, {
    //             //                         "categoryName": "Điện thoại"
    //             //                     });   

    //             // const [smartphoneResponse, laptopResponse, tabletResponse, watchResponse, otherResponse] = await Promise.all([fetchSmartphone, fetchLaptop, fetchTablet, fetchWatch, fetchOther]);

    //             const smartphoneResponse = await fetchSmartphone;

    //             if(smartphoneResponse.status === 200) {
    //                 const smartphoneData = smartphoneResponse.data.data;
    //                 setSmartphoneList(smartphoneData);
    //             }

    //             // if(laptopResponse.status === 200) {
    //             //     const laptopData = laptopResponse.data.data;
    //             //     setLaptopList(laptopData);
    //             // }
                
    //             // if(tabletResponse.status === 200) {
    //             //     const tabletData = tabletResponse.data.data;
    //             //     setTabletList(tabletData);
    //             // }   

    //             // if(watchResponse.status === 200) {
    //             //     const watchData = watchResponse.data.data;
    //             //     setWatchList(watchData);
    //             // }

    //             // if(otherResponse.status === 200) {
    //             //     const otherData = otherResponse.data.data;
    //             //     setOtherList(otherData);
    //             // }   
               
    //         }
    //         catch(error) {
    //             alert("Error");
    //         }
    //     }
       
    //     fetchData();
    // }, [])

    // useEffect(() => {
    //     // axios.post(`http://localhost:8000/api/category/getOneCategory`, {
    //     //     categoryName: "Điện thoại"
    //     // })
    //     //     .then((response) => {
    //     //         console.log(response.data.data);
    //     //     })
    //     const fetchData = async () => {
    //         const fetchSmartphoneData = axios.post(`http://localhost:8000/api/category/getOneCategory`,{
    //             categoryName: "Điện thoại"
    //         })

    //         const smartphoneResponse = await Promise.all(fetchSmartphoneData);
    //         if(smartphoneResponse.status === 200) {
    //             console.log(smartphoneResponse.data.data);
    //         }
    //     }   
    //     fetchData();
    // }, [])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchSmartphone = axios.post(`http://localhost:8000/api/category/getOneCategory?page=0&limit=4`, {
                    categoryName: "Điện thoại"
                });
                const fetchLaptop = axios.post(`http://localhost:8000/api/category/getOneCategory?page=0&limit=4`, {
                    categoryName:  "Laptop"
                });
                const fetchTablet = axios.post(`http://localhost:8000/api/category/getOneCategory?page=0&limit=4`, {
                    categoryName:  "Máy tính bảng"
                });
                const fetchWatch = axios.post(`http://localhost:8000/api/category/getOneCategory?page=0&limit=4`, {
                    categoryName:  "Đồng hồ thông minh"
                });
                const fetchOther = axios.post(`http://localhost:8000/api/category/getOneCategory?page=0&limit=4`, {
                    categoryName: "Phụ kiện"
                });
    
                const [smartphoneResponse, laptopResponse, tabletResponse, watchResponse, otherResponse] = await Promise.all([
                    fetchSmartphone, fetchLaptop, fetchTablet, fetchWatch, fetchOther
                ]);
    
                if (smartphoneResponse.status === 200) {
                    console.log("Smartphones:", smartphoneResponse.data.data);
                    setSmartphoneList(smartphoneResponse.data.data);
                }
                if (laptopResponse.status === 200) {
                    console.log("Laptops:", laptopResponse.data.data);
                    setLaptopList(laptopResponse.data.data);
                }
                if (tabletResponse.status === 200) {
                    console.log("Tablets:", tabletResponse.data.data);
                    setTabletList(tabletResponse.data.data);
                }
                if (watchResponse.status === 200) {
                    console.log("Watches:", watchResponse.data.data);
                    setWatchList(watchResponse.data.data);
                }
                if (otherResponse.status === 200) {
                    console.log("PHỤ KIỆN:", otherResponse.data.data);
                    setOtherList(otherResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

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
                                    onClick={() => window.location.href = (`/category/c01`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { smartphoneList.length > 0 && smartphoneList.map((prod, index) => (
                                <ProductCard prodID={prod.product_id} prodName={prod.pname} prodPrice={prod.price} prodRating={prod.rating} prodImage={prod.img[0]} />
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
                                    onClick={() => window.location.href = (`/category/c02`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { laptopList.length > 0 && laptopList.map((prod, index) => (
                                  <ProductCard prodID={prod.product_id} prodName={prod.pname} prodPrice={prod.price} prodRating={prod.rating} prodImage={prod.img[0]} />
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
                                    onClick={() => window.location.href = (`/category/c03`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { tabletList.length > 0 && tabletList.map((prod, index) => (
                                  <ProductCard prodID={prod.product_id} prodName={prod.pname} prodPrice={prod.price} prodRating={prod.rating} prodImage={prod.img[0]} />
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
                                    onClick={() => window.location.href = (`/category/c04`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { watchList.length > 0 && watchList.map((prod, index) => (
                                  <ProductCard prodID={prod.product_id} prodName={prod.pname} prodPrice={prod.price} prodRating={prod.rating} prodImage={prod.img[0]} />
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
                                    onClick={() => window.location.href = (`/category/c05`)}
                                >Xem tất cả</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 py-6 ">
                            { otherList.length > 0 && otherList.map((prod, index) => (
                                  <ProductCard prodID={prod.product_id} prodName={prod.pname} prodPrice={prod.price} prodRating={prod.rating} prodImage={prod.img[0]} />
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