import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Product({ productData }) {
    //console.log("Product Data:", state.productData);
    return (
        <DetailProduct productData={productData} />
    );
}

function DetailProduct({ productData }) {
    const [images, setImages] = useState({}); // Store images for products by ID
    const navigate = useNavigate()
    // Sort products by `sold` property
    const [sortedItems, setProduct] = useState([])
    useEffect(() => {
        setProduct(productData ? productData : [])
    }, [productData])
    //console.log(state.productData)
    // Fetch images for products in sortedItems
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
            for (let row of sortedItems || []) {
                try {
                    const response = await fetch(`http://localhost:8000/api/product/GetImageByProduct/${row.product_id}`);
                    if (!response.ok) throw new Error("Failed to fetch image");
                    const data = await response.json();
                    newImages[row.product_id] = data.data ? data.data.find(item => item.ismain) : null;
                } catch (error) {
                    console.error("Error fetching image:", error);
                    newImages[row.product_id] = null; // Fallback if image fetch fails
                }
            }
            setImages(newImages); // Update images state once all images are fetched
        };

        fetchImages();
    }, [sortedItems]);
    const [reviews, setReviews] = useState({});
    useEffect(() => {
        const fetchReviews = async () => {
            const newReviews = {};
            for (let row of sortedItems || []) {
                try {
                    const response = await fetch(`http://localhost:8000/api/product/GetReview/${row.product_id}`);
                    if (!response.ok) throw new Error("Failed to fetch review");
                    const data = await response.json();
                    newReviews[row.product_id] = data.data ? data.data : [];
                } catch (error) {
                    console.error("Error fetching review:", error);
                    newReviews[row.product_id] = []; // Fallback if image fetch fails
                }
            }
            setReviews(newReviews); // Update images state once all images are fetched
        };

        fetchReviews();
    }, [productData]);

    const Rate = (rate) => {
        if (rate == -1) return;
        if (rate <= 1.5)
            return `⭐`
        else if (rate <= 2.5)
            return `⭐⭐`
        else if (rate <= 3.5)
            return `⭐⭐⭐`
        else if (rate <= 4.5)
            return `⭐⭐⭐⭐`
        else return `⭐⭐⭐⭐⭐`
    }

    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 4, sortedItems.length - 4));
        setEnd((prev) => Math.min(prev + 4, sortedItems.length));
    };

    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    return (<div className="spotlight">
        <h2><span className='item'></span>Giới thiệu sản phẩm
            <span className='click left' onClick={handlePrevious}></span>
            <span className='click right' onClick={handleNext}></span></h2>
        <div className="spotlight-list">
            {sortedItems
                ? sortedItems.slice(start, end).map((row, index) => {
                    const img = images[row.product_id];
                    const review = reviews[row.product_id]
                    //console.log("Review: " + review)
                    const averageRate = review && review.length > 0
                        ? (review.reduce((sum, rev) => sum + parseFloat(rev.rating), 0) / review.length).toFixed(1)
                        : -1;
                    return (
                        <div
                            className="spotlight-product"
                            key={index}
                        >
                            <div className='product-view' onClick={() => navigate(`/product-detail/${row.product_id}`)}>
                                <img
                                    className="product-img"
                                    src={img ? img.image_url : "default_image.png"}
                                    alt="Product"
                                />
                            </div>
                            <div className="prod-data">
                                <div className="product-name">{row.pname}</div>
                                <div className="product-cash">
                                    {(() => {
                                        const format = String(row.price);
                                        let token = " đ";
                                        let checkpoint = 0;
                                        for (let i = format.length - 1; i >= 0; i--) {
                                            token = format[i] + token;
                                            checkpoint++;
                                            if (checkpoint === 3 && i !== 0) {
                                                token = "." + token;
                                                checkpoint = 0;
                                            }
                                        }

                                        return token;
                                    })()}{" "}
                                </div>
                                <div className='stars'>{averageRate === -1 ? "" : (
                                    <span style={{ textAlign: "left", marginLeft: "-210px" }}>
                                        <span style={{ color: "#FFD700" }}>
                                            {"★".repeat(Math.round(averageRate))}
                                        </span>
                                        <span style={{ color: "#ddd" }}>
                                            {"★".repeat(5 - Math.round(averageRate))}
                                        </span>
                                    </span>
                                )}<span style={{ textAlign: "left", fontWeight: "500", fontFamily: " 'Roboto', sans-serif", fontSize: "12px", justifyItems: "center", alignItems: "center", marginTop: "4.3px" }}>{review && review.length > 0 ? "(" + review.length + ")" : ""}</span>
                                </div>
                            </div>
                        </div>
                    );
                })
                : null}
        </div>
    </div>
    );
}

export default Product;
