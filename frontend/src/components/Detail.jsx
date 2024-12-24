import { useState } from "react"

export default function Detail({reviews, product, mainImage, otherImages, category, averageRate = "1", formatPrice, setMainImage, setOtherImages }) { 
 

    // Hàm thay đổi hình ảnh chính
    const switchImgPlace = (index) => {
        const temp = mainImage;
        const newOther = [...otherImages];  // Tạo bản sao mảng otherImages để thay đổi

        // Hoán đổi main image và hình ảnh phụ
        setMainImage(newOther[index]);
        newOther[index] = temp;
        setOtherImages(newOther);
    };
    
    // const category = state.categoryData.find(item => item.cate_id === product.cate_id);
    const [buyQuantity, setBuy] = useState(1)
    const changeQuantity = (charge)=>{
        if (charge == 1) setBuy(buyQuantity + 1 < product.quantity?buyQuantity+1:product.quantity)
        else setBuy(buyQuantity - 1 > 0?buyQuantity -1:0)
    }
    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0; // Chuyển chuỗi thành số hoặc mặc định là 0
        if (value >= 0 && value <= product.quantity) {
            setBuy(value);
        }
    };

    const handleAddCart = async () => {
        console.log(state.currentProduct.product_id)
        try {
            const response = await axios.post(
                `http://localhost:8000/api/cart/AddToCart/${state.currentUser.uid}`,
                {
                    product_id: product.product_id,
                    quantity: buyQuantity,
                }
            );
    
            if (response.status !== 200) {
                throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
    
            alert('Đã thêm sản phẩm vào giỏ hàng');
        } catch (e) {
            console.error("Error:", e.message || "Thêm vào giỏ hàng thất bại");
            alert("Thêm vào giỏ hàng thất bại: " + (e.message || "Lỗi không xác định"));
        }
    };
    

    if(reviews && product && mainImage && otherImages && category && formatPrice) return (
        <>
            <div className="breadcrumbs">
                <div>
                    <a href="#" className="off" onClick={(e) =>{e.preventDefault(); NavigateTo('Shopping')}}>Mua sắm</a> /
                    <a href="#" className="off" onClick={(e) =>{e.preventDefault(); ViewCategories(product.cate_id)}}>
                        {category ? category.cate_name : ""}
                    </a> / {product.pname}
                </div>
            </div>
            <div className="product-page">
                <div className="product-container">
                    <div className="thumbnails">
                        {otherImages.map((item, index) => (
                            <div key={index} className="thumbnail" onClick={() => switchImgPlace(index)}>
                                <img src={item ? item : ""} alt="Thumbnail" />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage ? mainImage : "default_image.png"} alt="Main" />
                    </div>
                    <div className="product-details">
                        <h1>{product.pname}</h1>
                        <div className="rating-stock">
                            <p><span style={{color: "red"}}>{averageRate}</span>/5.0 ({reviews.length} đánh giá) | <span className="stock-status">{product.quantity>0?"Còn "+product.quantity+" sản phẩm":"Hiện sản phẩm đã hết"}</span></p>
                        </div>
                        <p className="price">{formatPrice(product.price)}</p>
                        <div className="purchase-options">
                            <div className="quantity">
                                <button class="btn decrement" onClick={(e) => {e.preventDefault(); changeQuantity(0)}}>-</button>
                                <input
                                    type="text"
                                    value={buyQuantity}
                                    onChange={handleInputChange}
                                    style={{ width: "40px", textAlign: "center" }}
                                />
                                <button class="btn increment" onClick={(e) => {e.preventDefault(); changeQuantity(1)}}>+</button>
                            </div>
                            <button className="buy-now">Mua ngay</button>
                            <button className="add-to-cart" onClick={handleAddCart}>Thêm vào giỏ hàng</button>
                        </div>
                        <div className="info-box">
                            <div className="info-item">
                                <div className="icon">&#128666; </div>
                                <div>
                                    <p><strong>Giao hàng nhanh chóng</strong></p>
                                    <p>Giao hàng trong vòng 7 ngày kể từ khi thanh toán*</p>
                                </div>
                            </div>
                            <div className="info-item">
                            <div className="icon">&#128209; </div>
                                <div>
                                    <p><strong>Chính sách đổi trả</strong></p>
                                    <p>Miễn phí trả hàng trong vòng 30 ngày.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}