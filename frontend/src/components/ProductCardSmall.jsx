import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function ProductCartSmall({prodID, prodName, prodPrice, prodRating}) {
    const navigate = useNavigate();
    const [prodImage, setProdImage] = useState("");
    const [showBuy, setShowBuy] = useState(false);
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(prodPrice);
    console.log("CHECK PROD ID: ", prodID);


    const renderStars = (rating) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

        return (
            <div className="" >
                {[...Array(filledStars)].map((_, index) => (
                    <span key={index} className=" filled text-yellow-400">★</span>
                ))}
                {halfStar && <span className=" half-filled text-yellow-400">★</span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="">★</span>
                ))}
            </div>
        );
    };

    useEffect(() => {
       axios.get(`http://localhost:8000/api/product/GetImageByProduct/${prodID}`)
            .then((response) => {
                if(response.status === 200) {
                    const imgData = response.data.data;
                    console.log("FIRST CHECK: ", imgData);
                    if(Array.isArray(imgData) && imgData.length > 0) {
                        for(let img of imgData) {
                            if(img.ismain) {
                                setProdImage(img.image_url);
                                console.log("last check: ", img.image_url);
                                break;
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                if(error.response.data) {
                    alert(error.response.data.msg);
                } else {
                    console.log(error.message);
                }
            })
    }, [])

    return (
        <div className="w-48 inline-block justify-center items-center mx-auto">
            <div className="relative w-44 h-44 border bg-white flex justify-center items-center align-center rounded-lg"
                onMouseOver={() => setShowBuy(true)}
                onMouseOut={() => setShowBuy(false)}
                onClick={() => window.location.href = (`/customer/product-detail/${prodID}`)}
            >
                <div className="add-to-cart absolute top-1 right-1 bg-black text-white p-2 text-center rounded-full">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <img src={prodImage} alt="" className="w-auto h-28" />
                {showBuy ? 
                    <div className="buy-now absolute bottom-0 bg-black text-white w-full text-center p-1"
                        onClick={(e) => 
                            {e.stopPropagation();
                            navigate(`/customer/pay/${prodID}`)
                        }}
                    >
                        Buy Now
                    </div> : null}
                
            </div>
            <div className="w-full ">
                <h1 className="font-bold text-sm">{prodName}</h1>
                <div className="text-sm text-left justify-start">
                    <span className="text-red-600 text-left ">{formattedPrice}</span>
                </div>
                 <div className="space-x-1 text-sm" >
                    <span className="">
                        {renderStars(prodRating)}
                    </span>
                </div>

            </div>
        </div>
    )
}