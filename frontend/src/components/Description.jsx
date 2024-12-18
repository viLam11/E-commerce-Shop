import { useState, useEffect } from "react";

export default function Description({ product }) {
    if (!product) return null;
    if(product) return (
        <div className="prod-description">
            <h3>Thông tin chi tiết sản phẩm</h3>
            <div className="description">{product.description}</div>
        </div>
    );
}