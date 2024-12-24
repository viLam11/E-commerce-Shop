import { useState, useEffect } from "react";

export default function Review({ reviews , product }) {
    
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
    if(reviews && product) return (
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

// export default function Review({ reviews , product }) { 
//     return(
//         <div>
//             {product && product.pname}
//         </div>
//     )

// }