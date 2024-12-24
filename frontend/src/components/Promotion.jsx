import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Promotion({id, name, description, startTime, endTime, minSpent, discount_type, value, percentage, max_amount, apply_range, apply_id}) {
    const [finalVal, setFinalVale] = useState(null);
    const [finalType, setFinalType] = useState(null);   
    const [cateNames, setCatNames] =  useState([]);
    
    const navigate = useNavigate();
    
    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
    
        return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
    };

    useEffect(() => {
        console.log("Check apply range: ", apply_range);
        if (apply_range === "all") {
            setFinalType("Tất cả sản phẩm");
        } else if (apply_range === "category" && cateNames.length > 0) {
            const cateName = cateNames.find(cate => cate.cate_id === apply_id);
            setFinalType("Danh mục: " + (cateName ? cateName.cate_name : "Unknown"));
        } else if (apply_range === "product") {
            console.log("Product: " + name + apply_id);
            axios.get(`http://localhost:8000/api/product/get-detail/${apply_id}`)
                .then((response) => {
                    console.log("Check product: ", response.data.data);
                    if (response.data.data) {
                        setFinalType("Sản phẩm: " + response.data.data.pname);
                    } else {
                        setFinalType("Sản phẩm: Unknown");
                    }
                })
                .catch((err) => {
                    // if (err.response) {
                    //     alert(err.response.data.msg);
                    // } else {
                    //     console.log(err.message);
                    // }
                });
        }
    }, [cateNames, apply_range, apply_id, name]);


    useEffect(() => {   
        axios.get(`http://localhost:8000/api/category/getAll`)
            .then((response) => {
                // console.log("Check category: ", response.data.data);
                setCatNames(response.data.data);
            })
            .catch((error) => {
                if(error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.log(error.message); 
                }
            })
        
        if(discount_type === "fix price") {
            setFinalVale(formatNumber(value) + " VND");
        } else {
            setFinalVale(percentage + "%");
        }   
    }, [])

    function hanldeDelete(promoId) {
        console.log("Delete promotion: ", promoId); 
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?");
    
        if (confirmed) {
            axios.delete(`http://localhost:8000/api/promotion/DeletePromotion/${promoId}`)
                .then((response) => {
                    alert(response.data.msg);
                    window.location.reload();
                })
                .catch((error) => {
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        console.log(error.message);
                    }
                });
        } else {
            console.log("Người dùng đã hủy xóa mã giảm giá.");
        }
    }

    return(
        <div className="w-full  border-2 border-gray-400 rounded-xl m-auto p-4">
            
            <div className="discount space-y-1">
                <div className="text-xl font-bold">GIẢM {finalVal} - {name} </div>
                <div className="catergory text-normal font-semibold ">{finalType}</div>
            </div>
 
            {/* <div className="promo-code flex justify-between py-5 text-gray-700 font-medium " 
                
            >
                <span className="text-blue-700 font-semibold">Code: CODE_123sksdiof </span>
                <div className="space-x-2 text-lg text-black" style={{cursor: "pointer"}}
                    onMouseOver={() => {}}
                >     
                  <span>
                    <FontAwesomeIcon
                        icon={faCopy}
                        className="text-2xl"
                        />

                  </span>
                    <span>Copy</span>
                </div>
            </div> */}

            <div className="policy text-gray-500 pl-6 mt-2">
                <ul className="pl-4 list-disc">
                    <li className="time">
                       Hiệu lực: {formatDateTime(startTime)} - {formatDateTime(endTime)}
                    </li>
                    <li>
                        Áp dụng cho tất cả sản phẩm
                    </li>
                    <li>
                       Điều khoản: Giảm tối đa {max_amount} VND, đơn tối thiểu {minSpent} VND
                    </li>
                </ul>
            </div>
            <div className="flex justify-center space-x-4">
                    <button className="border-2 border-green-600 font-semibold text-green-600  py-1 w-20 hover:bg-green-100 "
                        onClick={() => navigate(`/admin/edit-promotion/${id}`)} 
                    >Chỉnh sửa</button>
                    <button className="border-2 border-red-500 font-semibold text-red-500 py-1 w-20 block hover:bg-red-50 "
                        onClick={() => hanldeDelete(id)}  
                    >Xóa</button>
            </div>

        </div>
    )
}