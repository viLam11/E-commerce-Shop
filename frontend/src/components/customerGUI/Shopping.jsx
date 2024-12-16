import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ProductByCategory({cate_name,cate_id, productData}){
    const navigate = useNavigate()
    const [sortProductByCategory, setSortByCategory] = useState(productData?productData.filter(item => item.cate_id == cate_id):null);
    useEffect(()=>{
        setSortByCategory(productData?productData.filter(item => item.cate_id == cate_id):null)
    },[productData])
    //console.log(sortProductByCategory)
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = [];
            for (let row of sortProductByCategory || []) {
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
    }, [sortProductByCategory]);
    //console.log(images)
    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 4, sortProductByCategory.length - 4));
        setEnd((prev) => Math.min(prev + 4, sortProductByCategory.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    return (sortProductByCategory &&
        <>
        <div className="view-all-container">
                            <h3>{cate_name}</h3>
                            <button className="view-all-button" onClick={(e)=>{e.preventDefault();navigate(`/category/${cate_id}`)}}>Xem tất cả sản phẩm</button>
                        </div>

                        <div className='spotlight-list'>
            
            {sortProductByCategory?sortProductByCategory.slice(start,end).map((row, index) => {
                const productImage = images[row.product_id];
                return (
                    <div className="spotlight-product" onClick={() => navigate(`/product-detail/${row.product_id}`)} key={index}>
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

function Shopping({productData}){
    const categoryData = [{cate_id: "c01", cate_name:"Điện thoại"}, {cate_id: "c02", cate_name:"Laptop"}, {cate_id: "c03", cate_name:"Máy tính bảng"}, {cate_id: "c04", cate_name:"Đồng hồ thông minh"}, {cate_id: "c05", cate_name:"Phụ kiện"}]
    if(!categoryData) throw("No cate data defined")
    return (
        <>
            <div style={{marginTop:"80px"}}><span style={{color:"gray",cursor:"pointer"}} onClick={() => NavigateTo('HomePage')}>Trang chủ</span> / <span style={{color: "black"}}>Mua sắm</span></div>
            {categoryData.map((token, index)=>{
                return(

                    <div key={index} className="spotlight">
                            <ProductByCategory cate_name = {token.cate_name} cate_id = {token.cate_id} productData={productData}/>
                    </div>
                );
            })}
        </>
    )
}
function ShoppingPage(){
    const [productData, setData] = useState();
    useEffect(()=>{
        const fetchData = async() => {
            try{
                const rdata = await axios.get(`http://localhost:8000/api/product/getAll?limit=1000`)
                console.log(rdata)
                if (rdata.status != 200) throw new Error("Feth data fail")
                setData(rdata.data.data)
            }
            catch(err){
                console.error("Error: ", err.message)
            }
        }
        fetchData()
    },[])
    return(productData &&
        <div className='Shopping'>
            <Shopping productData={productData}/>
        </div>
    )
}

export default ShoppingPage;