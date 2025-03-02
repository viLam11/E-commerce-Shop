import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductByCategory({cate_name, cate_id}){    
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchCategoryAndImages = async () => {
            try {
                const categoryResponse = await axios.post(`http://localhost:8000/api/category/getOneCategory`, {
                    "categoryName": "Điện thoại"
                });
                const prodList = categoryResponse.data.data;
                console.log(prodList);
                setProductList(prodList);
    
                const newImages = [];
                for (let row of prodList || []) {
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
                console.log(newImages);
                setImages(newImages); 
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            }
        };
    
        fetchCategoryAndImages();

    }, []);

    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 4, productList.length - 4));
        setEnd((prev) => Math.min(prev + 4, productList.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    return (
        <>
        <div className="view-all-container">
                            <h3>{cate_name}</h3>
                            <button className="view-all-button" 
                                onClick={(e)=>{}}
                            >Xem tất cả sản phẩm</button>
                        </div>

                        <div className='spotlight-list'>
            
            {productList?productList.slice(start,end).map((row, index) => {
                const productImage = images[row.product_id];
                return (
                    <div className="spotlight-product" onClick={() => ViewProductDetail(row.product_id)} key={index}>
                        <div className="product-view">
                            <img 
                                className="product-img" 
                                src={productImage ? productImage.image_url : "default_image.png"} 
                                alt="Product" 
                            />
                        </div>
                        <div className='product-data'>
                            <div className="product-name">{row.pname}</div>
                            <div className="product-cash">{(() => {
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
                                })()}</div>
                            <p className="product-rating">★★★★☆ (65)</p>
                        </div>
                    </div>
                );
            }):null}
            </div>
        </>
        
    )
    
    

}
