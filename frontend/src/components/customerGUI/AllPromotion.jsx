import Header from "./Header";
import Footer from "../Footer";
import Promotion from "../../components/Promotion";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AllPromotion() {
    const navigate = useNavigate();
    const [promotionData, setPromotionData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/promotion/getAll")
            .then((response) => {
                // const promoArray = response.data;
                // // setPromotionData([...promoArray]);
                // alert(promoArray);
                console.log(response);
                console.log(response.data);
                console.log(response.data.data);
                const data = response.data.data;
                // console.log("CHECK DATA 1:", data);
                setPromotionData(response.data.data);
                // console.log("CHECK DATA 2:", promotionData);
            })
            .catch((error) => {
                if (error.response) {
                  alert(error.response.data.msg);
                } else {
                  console.error('Error:', error.message);
                }
              })
    }, [])

    console.log("CHECK DATA 3:", promotionData);

    // if (promotionData.length < 1) {
    //     return (
    //         <div className="flex flex-col min-h-screen">
    //             <Header role={"admin"} />
    //             <main className="flex-grow flex justify-center items-center"> 
    //                     <h2>Chưa có mã giảm giá nào được thêm vào</h2>
    //             </main>
    //             <Footer />
    //         </div>
    //     )
    // }    
    if(promotionData.length > 0)
     return (
        <div className="flex flex-col min-h-screen">
            <Header role={"admin"} />
            <main className="flex-grow">
                <div className="m-2 pl-12" style={{marginTop:"100px"}}>
                    <span className="text-grey-500">User / </span>
                    <span className=" font-medium">All Promotion</span>
                </div>
                <div className="w-11/12 m-auto text-sm">
                    <div className="grid grid-cols-3 gap-4 m-auto ">
                        {/* <Promotion />
                        <Promotion />
                        <Promotion />
                        <Promotion />
                        <Promotion />
                        <Promotion />
                         */}
                        
                         { promotionData.map((promoData) =>  
                                <Promotion />
                         )}
                    </div>
                </div>


                <div className="h-24 flex justify-end items-end">
                    <div className="mb-10 mr-20 text-sm">
                        <Pagination />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
    // return(
    //     <></>
    //     // <>{promotionData.forEach(element => {
    //     //     <p>element</p>  
    //     // })}</>
    // )
}