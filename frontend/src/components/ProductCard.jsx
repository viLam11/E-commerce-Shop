// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// export default function ProductCard({ prodID, prodName, prodPrice, prodRating }) {
//     const navigate = useNavigate();
//     const [showBuy, setShowBuy] = useState(false);


//     return (
//         <>
//             <div className="w-50 inline-block justify-center items-center mx-auto">
//                 <div className="relative w-60 h-56 border bg-white flex justify-center items-center align-center rounded-lg"
//                     onMouseOver={() => setShowBuy(true)}
//                     onMouseOut={() => setShowBuy(false)}
//                     onClick={() => navigate(`/customer/productDetail/${prodID}`)}
//                 >
//                     <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" className="w-auto h-40" />
//                     {showBuy ?
//                         <div className="buy-now absolute bottom-0 bg-black text-white w-full text-center p-1"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/customer/pay/${prodID}`)
//                             }}
//                         >
//                             Buy Now
//                         </div> : null}

//                 </div>
//                 <div className="w-full pl-2">
//                     <h1 className="font-bold ">SamSung Galaxy S24 Plus</h1>
//                     <div className="price">
//                         <span className="text-red-600">21.990.000 VND</span>
//                         <span className="mx-2 line-through">22.000.000</span>
//                     </div>
//                     <div class="rating space-x-1">
//                         <span class="star filled text-yellow-400">★</span>
//                         <span class="star filled text-yellow-400">★</span>
//                         <span class="star filled text-yellow-400">★</span>
//                         <span class="star text-yellow-400">★</span>
//                         <span class="star">★</span>

//                         <span>(88)</span>
//                     </div>

//                 </div>

//             </div>
//         </>
//     )
// }


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({prodID, prodName, prodPrice, prodRating, prodImage}) {
    const navigate = useNavigate();
    const [showBuy, setShowBuy] = useState(false);
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(prodPrice);
    console.log("CHECK PROD ID: ", prodID);
    console.log("CHECK PROD image: ", prodImage);

    const renderStars = (rating) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

        return (
            <>
                {[...Array(filledStars)].map((_, index) => (
                    <span key={index} className="star filled text-yellow-400">★</span>
                ))}
                {halfStar && <span className="star half-filled text-yellow-400">★</span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="star">★</span>
                ))}
            </>
        );
    };

    return (
        <div className="w-56 border-box inline-block justify-center items-center mx-auto">
            <div className="relative w-56 h-56 border bg-white flex justify-center items-center align-center rounded-lg mx-auto"
                onMouseOver={() => setShowBuy(true)}
                onMouseOut={() => setShowBuy(false)}
                onClick={() => window.location.href = (`/customer/productDetail/${prodID}`)}
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
            <div className="w-full pl-2">
                <h1 className="font-bold text-sm">{prodName}</h1>
                <div className="price text-sm">
                    <span className="text-red-600">{formattedPrice}</span>
                    {/* <span className="mx-2 line-through">22.000.000</span> */}
                </div>
                 <div className="rating space-x-1 text-sm">
                {renderStars(prodRating)}
                <span>({prodRating})</span>
            </div>

            </div>
        </div>
    )
}