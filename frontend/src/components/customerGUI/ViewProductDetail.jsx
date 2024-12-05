import React, {useState,useEffect} from "react";
import RatingBar from "../format/ratingBar";
import axios from 'axios'
function Detail({reviews, state, NavigateTo, ViewCategories }) {
    const product = state.productData ? state.productData.find(item => item.product_id === state.currentProduct) : null;
    if (!product) return null;

    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const averageRate = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1) 
        : "0.0";
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
    return (
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
                            <button className="add-to-cart">Thêm vào giỏ hàng</button>
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

function Description({ product }) {
    if (!product) return null;
    return (
        <div className="prod-description">
            <h3>Thông tin chi tiết sản phẩm</h3>
            <div className="description">{product.description}</div>
        </div>
    );
}

function Review({ reviews,state, product }) {
    
    const averageRate = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1) 
        : -1;
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
        if (averageRate == -1) return;
        else if (averageRate <= 1.5) return `⭐`
        else if (averageRate <= 2.5) return `⭐⭐`
        else if (averageRate <= 3.5) return `⭐⭐⭐`
        else if (averageRate <= 4.5) return `⭐⭐⭐⭐`
        else return `⭐⭐⭐⭐⭐`
    }
    const RateSwitch = (rate) =>{
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
        ratingsBreakdown[reviews[i].rating - 1]++;
    }

    const getDate = () => {
        const now = new Date();
        return now.toLocaleString(); 
    };

    const [newReview, setNew] = useState({
        rating: 0,
        comment: "",
        time: getDate()
    })
    const [comment, setComment] = useState("")
    const [starRate, setStarRate] = useState(0)

    const handleAddReview = async (e) => {
        e.preventDefault()
        try {
            const newDate = getDate()
            const rating = starRate
            const uid = state.currentUser.uid
            const response = await axios.post(
                `http://localhost:8000/api/product/CreateReview/${product.product_id}`,
                {
                    comment,
                    rating,
                    newDate,
                    uid
                }
            );
            console.log("Đánh giá đã được thêm:", response.data);
            alert("Đánh giá của bạn đã được gửi!");
        } catch (error) {
            console.error("Lỗi khi thêm đánh giá:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };
    const calculateStarPercentage = (starLevel) =>
        ((ratingsBreakdown[starLevel - 1] || 0) / totalRatings) * 100;
    
    const getBarWidth = (ratingCount) =>
        reviews && reviews.length > 0 ? (ratingCount / reviews.length) * 100 : 0;
    return (
        <div className="review-prod">
            <h3>Đánh giá và nhận xét {product.pname}</h3>
            <div className="rating-container">
                <div className="rating-summary">
                    <div className="average-rating">
                    <span className="rating-value">{averageRate}/5</span>
                    <div className="stars">
                        <span>{Rate(averageRate)}</span>
                    </div>
                    <div className="rating-count">{totalRatings} đánh giá</div>
                    </div>
                </div>
                <div className="slash"></div>
                <div className="rating-distribution">
                    <div className="rating-row">
                    <span>5 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(5)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[4]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>4 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(4)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[3]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>3 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(3)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[2]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>2 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(2)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[1]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>1 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(1)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[0]} đánh giá</span>
                    </div>
                </div>
                </div>

            <div className="review-of-customer">
                {reviews.map((review, index) => (
                    <div key={index} className="a-review">
                        <div className="By">{review.uid}<span style={{marginLeft: '40px'}}> {viewTime(review.time)}</span></div>
                        <div><b>Rating:</b> <span style={{color: 'red'}}>{RateSwitch(review.rating)}</span></div>
                        <div><b>Comment:</b> {review.comment}</div>
                    </div>
                ))}
                <form>
                    <select value={starRate} onChange={(e)=>setStarRate(e.target.value)}>
                        <option value="" >Đánh giá</option>
                        <option value="5">5 ⭐</option>
                        <option value="4">4 ⭐</option>
                        <option value="3">3 ⭐</option>
                        <option value="2">2 ⭐</option>
                        <option value="1">1 ⭐</option>
                    </select>
                    <input type="text" placeholder="Thêm đánh giá" value={comment} onChange={(e)=>setComment(e.target.value)}/>
                    <button type = "submit" onClick={handleAddReview}>Thêm review</button>
                </form>
            </div>
        </div>
    );
}

function ViewDetail({ state, ViewProductDetail, NavigateTo, ViewCategories }) {
    const product = state.productData ? state.productData.find(item => item.product_id === state.currentProduct) : null;
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
    return (
        <div className="viewpage">
            <Detail state={state} NavigateTo={NavigateTo} reviews = {reviews} ViewCategories={ViewCategories}/>
            <Description product={product} />
            <Review product={product} state={state} reviews={reviews}/>
        </div>
    );
}

export default ViewDetail;

// Helper function for price formatting
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
