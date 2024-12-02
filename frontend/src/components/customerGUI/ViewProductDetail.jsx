import React, {useState,useEffect} from "react";
import RatingBar from "../format/ratingBar";

function Detail({ state, NavigateTo, ViewCategories }) {
    const product = state.productData ? state.productData.find(item => item.product_id === state.currentProduct) : null;
    if (!product) return null;

    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/product/GetImageByProduct/${product.product_id}`);
                if (!response.ok) throw new Error("Failed to fetch image");
                const data = await response.json();
                const newImages = data.data || [];

                // Cập nhật lại mainImage và otherImages sau khi tải hình ảnh
                const main = newImages.find(item => item.product_id === product.product_id && item.ismain);
                const others = newImages.filter(item => item.product_id === product.product_id && !item.ismain);

                setMainImage(main || null);  // Nếu không có main image, sử dụng null
                setOtherImages(others);      // Cập nhật mảng các hình ảnh phụ
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImages();
    }, [product.product_id]);  // Chạy lại useEffect nếu product_id thay đổi

    // Hàm thay đổi hình ảnh chính
    const switchImgPlace = (index) => {
        const temp = mainImage;
        const newOther = [...otherImages];  // Tạo bản sao mảng otherImages để thay đổi

        // Hoán đổi main image và hình ảnh phụ
        setMainImage(newOther[index]);
        newOther[index] = temp;
        setOtherImages(newOther);
    };
    const category = state.categoryData.find(item => item.cate_id === product.cate_id);
    return (
        <>
            <div className="breadcrumbs">
                <div>
                    <a href="#" className="off" onClick={() => NavigateTo('Shopping')}>Mua sắm</a> /
                    <a href="#" className="off" onClick={() => ViewCategories(category ? category.cate_id : "")}>
                        {category ? category.cate_name : ""}
                    </a> / {product.pname}
                </div>
            </div>
            <div className="product-page">
                <div className="product-container">
                    <div className="thumbnails">
                        {otherImages.map((item, index) => (
                            <div key={index} className="thumbnail" onClick={() => switchImgPlace(index)}>
                                <img src={item ? item.image_url : ""} alt="Thumbnail" />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage ? mainImage.image_url : "default_image.png"} alt="Main" />
                    </div>
                    <div className="product-details">
                        <h1>{product.pname}</h1>
                        <div className="rating-stock">
                            <p>★★★★★ ( Reviews) | <span className="stock-status">In Stock</span></p>
                        </div>
                        <p className="price">{formatPrice(product.price)}</p>
                        <div className="purchase-options">
                            <div className="quantity">
                                <input id="quantity-val" type="number" defaultValue="1" min="1" max={product.quantity} />
                            </div>
                            <button className="buy-now">Buy Now</button>
                            <button className="add-to-cart">Add to cart</button>
                        </div>
                        <div className="info-box">
                            <div className="info-item">
                                <p><strong>Giao hàng nhanh chóng</strong></p>
                                <p>Giao hàng trong vòng 7 ngày kể từ khi thanh toán*</p>
                            </div>
                            <div className="info-item">
                                <p><strong>Chính sách đổi trả</strong></p>
                                <p>Miễn phí trả hàng trong vòng 30 ngày. <a href="#">Chi tiết</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Description({ product }) {
    if (!product) return null;
    return (
        <div className="prod-description">
            <h3>Thông tin chi tiết sản phẩm</h3>
            <div className="description">{product.description}</div>
        </div>
    );
}

function Review({ state, product }) {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchReviews = async () => {
            let newReviews = [];
            try {
                const response = await fetch(`http://localhost:8000/api/product/GetReview/${product.product_id}`);
                if (!response.ok) throw new Error("Failed to fetch image");
                const data = await response.json();
                newReviews = data.data||[];

            } catch (error) {
                console.error("Error fetching image:", error);
                newReviews = []; // Fallback if image fetch fails
            }
            setReviews(newReviews); // Update images state once all images are fetched
        };

        fetchReviews();
    }, []);
    const averageRate = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1) 
        : "0.0";
    const ratings = [5, 4, 3, 2, 1].reduce((acc, rating) => ({
        ...acc,
        [rating]: reviews.filter(review => review.rating === rating).length
    }), {});

    const viewTime = (time) =>{
        const date = new Date(time);

        // Lấy các thành phần thời gian
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm

        // Định dạng thành chuỗi "h:m dd/mm/yy"
        return `${hours}:${minutes.toString().padStart(2, '0')} ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/20${year}`;
    }

    const Rate = (rate) =>{
        switch(rate){
            case 1:
                return `⭐`
            case 2:
                return `⭐⭐`
            case 3:
                return `⭐⭐⭐`
            case 4:
                return `⭐⭐⭐⭐`
            case 5:
                return `⭐⭐⭐⭐⭐`
        }
    }
    
    let ratingsBreakdown = [0, 0, 0, 0, 0]
    let totalRatings = reviews.length;
    for (let i = 0; i < reviews.length; i++){
        ratingsBreakdown[reviews.rating - 1]++;
    }

    const calculateStarPercentage = (starLevel) =>
        ((ratingsBreakdown[starLevel - 1] || 0) / totalRatings) * 100;

    return (
        <div className="review-prod">
            <h3>Đánh giá và nhận xét {product.pname}</h3>
            <div className="review-of-customer">
                {reviews.map((review, index) => (
                    <div key={index} className="a-review">
                        <div className="By">{review.uid}<span style={{marginLeft: '40px'}}> {viewTime(review.time)}</span></div>
                        <div><b>Rating:</b> <span style={{color: 'red'}}>{Rate(review.rating)}</span></div>
                        <div><b>Comment:</b> {review.comment}</div>
                    </div>
                ))}
                {/* <form>
                    <input type="text" placeholder="Thêm đánh giá" />
                    <input type="image" src="../../public/icon/arrow_right_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png" />
                </form> */}
            </div>
        </div>
    );
}

function ViewDetail({ state, ViewProductDetail, NavigateTo, ViewCategories }) {
    const product = state.productData ? state.productData.find(item => item.product_id === state.currentProduct) : null;
    return (
        <div className="viewpage">
            <Detail state={state} NavigateTo={NavigateTo} />
            <Description product={product} />
            <Review product={product} state={state}/>
        </div>
    );
}

export default ViewDetail;

// Helper function for price formatting
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
