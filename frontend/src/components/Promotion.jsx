import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"

export default function Promotion() {
    return(
        <div className="w-full min-h-60 border-2 border-gray-400 rounded-xl m-auto p-4">
            
            <div className="discount space-y-1">
                <div className="text-3xl font-bold">GIẢM 5%</div>
                <div className="catergory text-md font-semibold uppercase">tất cả sản phẩm</div>
            </div>

            <div className="promo-code flex justify-between py-5 text-gray-700 font-medium " 
                
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
            </div>

            <div className="policy text-gray-500 pl-6">
                <ul className="pl-4 list-disc">
                    <li className="time">
                       Hiệu lực: 12/02/2024 4:00 - 09/08/2024 23:59 
                    </li>
                    <li>
                        Áp dụng cho tất cả sản phẩm
                    </li>
                    <li>
                       Điều khoản: Giảm tối đa 50.000, đơn tối thiểu 100.000 VND
                    </li>
                </ul>
            </div>

        </div>
    )
}