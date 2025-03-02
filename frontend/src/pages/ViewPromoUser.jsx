import Header from "../components/customerGUI/Header";
import Footer from "../components/Footer";
import Promotion from "../components/Promotion";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserPromo from "../components/UserPromo";

export default function ViewPromoUser({role}) {
    const navigate = useNavigate();
    const [promotionData, setPromotionData] = useState([]);
    const [currentPromo, setCurrentPromo] = useState([]);    
    const [currentPage, setCurrentPage]  = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8000/api/promotion/getAll")
            .then((response) => {
                const allPromoList = response.data.data;
                setPromotionData(allPromoList);
                let currentList = allPromoList.slice(0, 6);
                let totalPage = Math.ceil(allPromoList.length / 6);
                setCurrentPromo(currentList);
                setTotalPage(totalPage);
                setCurrentPage(0);
            })
            .catch((error) => {
                if (error.response) {
                  alert(error.response.data.msg);
                } else {
                  console.error('Error:', error.message);
                }
              })
    }, [])

    function handlePageClick(pageNum) {
        const index = Number(pageNum);
        const newArr = promotionData.slice(index * 6, (index + 1) * 6);
        console.log(newArr);
        setCurrentPage(index);
        setCurrentPromo(newArr);
    }
    
    if(promotionData.length > 0)
     return (
        <div className="flex flex-col min-h-screen">
            <Header role="admin" />
            <main className="flex-grow mt-20">
                <div className="m-2 pl-12">
                    <span className="text-grey-500">User / </span>
                    <span className=" font-medium">All Promotion</span>
                </div>
                <div className="w-11/12 m-auto text-sm">
                    <div className="grid grid-cols-3 gap-4 m-auto ">                        
                         {Array.isArray(currentPromo) && currentPromo.length > 0 &&  currentPromo.map((promoData, index) =>  
                                <UserPromo key={index} id={promoData.promotion_id} name={promoData.name} description={promoData.description} startTime={promoData.starttime} endTime={promoData.endtime} minSpent={promoData.minspent} discount_type={promoData.discount_type} value={promoData.value} percentage={promoData.percentage} max_amount={promoData.max_amount} apply_range={promoData.apply_range} apply_id={promoData.apply_id}  />
                         )}
                    </div>
                </div>


                <div className="h-16 flex flex-end justify-end items-end">    
                        <div className="mb-4 mr-10">
                        <div className="flex justify-end mr-20">
                        {/* <Pagination /> */}
                            {Array.from({ length: totalPage }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageClick(i)} 
                                    className={`px-3 py-1 mx-1 hover:bg-blue-300 ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                        } rounded`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        </div>
                    </div>
            </main>
            <Footer />
        </div>
    )
}