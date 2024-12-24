import React, {useState,useEffect} from "react";
import RatingBar from "../components/format/RatingBar";
import Detail from "../components/Detail";
import Review from "../components/Review";
import Description from "../components/Description";
import axios from 'axios';
import { useParams } from "react-router-dom";
// const prodID = "13cf029b-44b4-41db-a59c-d8126f3e5787";

export default function ViewDetail() {
    const {prodID} = useParams()
    console.log(prodID)
    // const prodID = "13cf029b-44b4-41db-a59c-d8126f3e5787";
    const [reviews, setReviews] = useState([]);
    const [product, setProduct] = useState(null);   
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [catName, setCatName]  = useState(null);

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    useEffect(() => {
        const fetchReviews = async () => {
            let newReviews = [];
            try {
                const response = await fetch(`http://localhost:8000/api/product/GetReview/${prodID}`);
                // alert("Load review")
                if (!response.ok) throw new Error("Failed to fetch image");
                const data = await response.json();
                newReviews = data.data||[];

            } catch (error) {
                console.error("Error fetching image:", error);
                newReviews = []; // Fallback if image fetch fails
            }
            setReviews(newReviews); // Update images state once all images are fetched
        };

        const fetchData = async () => {
            try {
                const fetchProductData = axios.get(`http://localhost:8000/api/product/get-detail/${prodID}`);
                const [prodResponse] = await Promise.all([fetchProductData]);

                if(prodResponse.status === 200) {
                    console.log("CHECK PROD DATA: ", prodResponse.data.data);
                    const prodData = prodResponse.data.data;    
                    if(prodData.cate_id === "c01") setCatName("Điện thoại")
                    else if (prodData.cate_id === "c02") setCatName("Laptop")
                    else if(prodData.cate_id === "c03") setCatName("Máy tính bảng") 
                    else if(prodData.cate_id === "c04") setCatName("Đồng hồ thông minh")
                    else setCatName("Phụ kiện");

                    setProduct(prodResponse.data.data); 
                    const imgData = prodResponse.data.data.image;
                    console.log("CHECK IMG DATA: ", imgData[0]);   
                    setMainImage(imgData[0]);
                    setOtherImages(imgData.slice(1));
                }

            } catch (error) {
                console.error("Error fetching image:", error);
            }
            


        }
        fetchData();

        fetchReviews();
    }, []);


    return (
        <div className="viewpage">
            <Detail product={product} reviews={reviews} mainImage={mainImage} otherImages={otherImages} category={catName} formatPrice={formatPrice} setMainImage={setMainImage} setOtherImages={setOtherImages} />
            <Description product={product} />
            <Review product={product} reviews={reviews}/> 
        </div>
    );
}


