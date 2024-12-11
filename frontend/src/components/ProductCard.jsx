import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function ProductCard({prodID, prodName, prodPrice, prodRating}) {
    const [showBuy, setShowBuy] = useState(false);

    return (
        <div className="w-50 inline-block justify-center items-center mx-auto">
            <div className="relative w-60 h-56 border bg-white flex justify-center items-center align-center rounded-lg"
                onMouseOver={() => setShowBuy(true)}
                onMouseOut={() => setShowBuy(false)}
            >
                <img src="https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/xiaomi_14t_black_1_bb226cd286.png" alt="" className="w-auto h-40" />
                <div className="cart-icon absolute right-2 top-2  rounded-full p-2 bg-indigo-300 hover:bg-indigo-400 ">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                {showBuy ? <div className="buy-now absolute bottom-0 bg-black text-white w-full text-center p-1">Buy Now</div> : null}
                
            </div>
            <div className="w-full pl-2">
                <h1 className="font-bold ">SamSung Galaxy S24 Plus</h1>
                <div className="price">
                    <span className="text-red-600">21.990.000 VND</span>
                    <span className="mx-2 line-through">22.000.000</span>
                </div>
                <div class="rating space-x-1">
                    <span class="star filled text-yellow-400">★</span>
                    <span class="star filled text-yellow-400">★</span>
                    <span class="star filled text-yellow-400">★</span>
                    <span class="star text-yellow-400">★</span>
                    <span class="star">★</span>

                    <span>(88)</span>
                </div>

            </div>
        </div>
    )
}