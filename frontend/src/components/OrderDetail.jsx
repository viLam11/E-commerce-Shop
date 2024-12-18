import { useState, useEffect } from "react";
import axios from "axios";

export default function OrderDetail({ productList, orderID, setDetailMode, shippingFee, finalPrice, totalPrice }) {
    console.log("PRODUCT LIST: ", productList);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="bg-white border border-black p-6 rounded-lg shadow-lg w-full max-w-md mt-4 mx-auto">
                <h1 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h1>
                {/* <div>#1 Sản phẩm ... tên ...</div>
                <div>Giá: 1000</div>
                <div>Số lượng: 2</div>
                <div>Thành tiền: 2000</div>
                <div>.....</div>
                <div>Mã giảm giá:</div>
                <div>Số tiền được giảm: 20000</div>
                <div>Tổng tiền thanh toán: ....</div> */}

                {productList.map((prod, index) => (
                    <div>
                        <div>#{index + 1} Sản phẩm ... (id) {prod.product_id} ...</div>
                        <div>Giá: ...</div>
                        <div>Số lượng: {prod.quantity}</div>
                        <div>Thành tiền: {prod.paid_price}</div>

                        <div>Mã giảm giá: {prod.promotion_id} </div>
                    </div>
                ))}

                
                <div>Số tiền được giảm: 20000</div>
                <div>Tổng tiền thanh toán: {totalPrice}</div>

                <div className="border border-black p-1 mx-auto w-20 text-center rounded-sm"
                    onClick={() => setDetailMode(false)}
                >Đóng</div>
            </div>
        </div>
    );
}
