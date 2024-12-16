import axios from "axios";
import Product from "./Product";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../design/Home/banner.css'
import '../../design/Home/category.css'
import '../../design/Home/highlight.css'
import '../../design/Home/productIntro.css'

function Banner({productData}) {
    const [activeIndex, setActiveIndex] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % 5); // Có 5 vòng tròn, nên dùng % 5
        }, 3000);

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, []);
    const images = ['../../../public/img/ads8.jpg',
        '../../../public/img/ads13.jpg',
        '../../../public/img/maxresdefault (1).jpg',
        '../../../public/img/ads10.png',
        '../../../public/img/banner1.jpg']
    const pickAds = (index) => {
        setActiveIndex(index)
    }
    return (
        <div className="banner">
            <div className="side">
                <div className="item">
                    <h2 onClick={()=>navigate('/user/category/c01')}>Điện thoại</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>navigate('/user/category/c02')}>Laptop</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>navigate('/user/category/c03')}>Máy tính bảng</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>navigate('/user/category/c04')}>Đồng hồ thông minh</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>navigate('/user/category/c05')}>Phụ kiện</h2>
                    <div className="underline"></div>
                </div>
            </div>
            <div className="horizon"></div>
            <div className="ads">
                <img src={images[activeIndex]} alt="ADS" />
            </div>
            <div className="pagination">
                {Array.from({ length: 5 }).map((_, index) => (
                    <span
                        key={index}
                        className={`circle ${index === activeIndex ? "active" : ""}`}
                        onClick={() => pickAds(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

function CategoryBar(){
    return(
        <div className="searching">
            <h3>Phân loại</h3>
            <div className="category-buttons">
                <a className="category-type" href="/user/category/c01">
                    <div>
                        <img src="../../public/img/s-l960 (1).webp" alt='Phone' style={{marginBottom: '6px' ,marginTop: '3px'}}/>
                        <br /> <span>Điện thoại</span>
                    </div>
                </a>
                <a className="category-type" href="/user/category/c04" >
                    <div>
                        <img src="../../public/img/s-l960.webp" style={{marginBottom: '12px' }}/>
                        <br /> <span>Đồng hồ thông minh</span>
                    </div>
                </a>
                <a className="category-type" href="/user/category/c02">
                    <div>
                        <img src= "../../public/img/s-l960 (2).webp" style={{marginBottom: '23px',marginTop: '15px'}}/>
                        <br /> <span>Laptop</span>
                    </div>
                </a>
                <a className="category-type" href="/user/category/c03">
                    <div>
                        <img src="../../public/img/s-l960 (3).webp" style={{marginBottom: '26px' ,marginTop: '8px'}}/>
                        <br /> <span>Tablet</span>
                    </div>
                </a>
                <a className="category-type" href="/user/category/c05">
                    <div>
                        <img src="../../public/img/mobile-phone-accessories-for-sell-e-commerce-portal.jpg"style={{marginBottom: '16px' ,marginTop: '8px'}}/>
                        <br /> <span>Phụ kiện</span>
                    </div>
                </a>
            </div>
        </div>
    )
}

function FlashProduct({productData}) {
    const navigate = useNavigate()
    const [images, setImages] = useState({}); // Store images for products by ID

    // Sort products by `sold` property
    const [sortedItems, setProduct] = useState([])
    useEffect(()=>{
        setProduct(productData
            ? [...productData].sort((a, b) => (b.sold || 0) - (a.sold || 0)):[])
    },[productData]) 
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
                    if (!response.ok) throw new Error("Failed to fetch image");
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
    
    return (
        <div className="spotlight">
            {/* <h2>Tháng này</h2> */}
            <h2 className="view-all-container">
                Các sản phẩm đang bán chạy
                <span className='click left' onClick = {handlePrevious}></span>
                <span className='click right' onClick={handleNext}></span>
            </h2>
            
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
                                  <div className="product-view" onClick={() => navigate(`/product-detail/${row.product_id}`)}>
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
                                            <span style={{textAlign: "left",marginLeft:"-210px"}}>
                                                <span style={{ color: "#FFD700"}}>
                                                {"★".repeat(Math.round(averageRate))}
                                                </span>
                                                <span style={{ color: "#ddd" }}>
                                                {"★".repeat(5 - Math.round(averageRate))}
                                                </span>
                                            </span>
                                            )}<span style={{textAlign: "left",fontWeight:"500", fontFamily:" 'Roboto', sans-serif",fontSize: "12px",justifyItems:"center",alignItems:"center",marginTop:"4.3px"}}>{review && review.length > 0?"("+ review.length + ")":""}</span>
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

function HomePage(){
    //console.log("Home Data: " + state.productData)
    const [productData, setData] = useState([])
    const navigate = useNavigate()
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

    return(productData && <div id ='home'>
        <div className="container">
            <Banner productData={productData}/>
        </div>
        <Product productData={productData}/>
        <div className="view-all-container">
            <button className="view-all-button" onClick={()=>navigate('/user/shopping')}>Xem tất cả sản phẩm</button>
            <div className="underline"></div>
        </div>
        
        <CategoryBar productData={productData}/>
        <FlashProduct productData={productData}/>
        <button className="view-all" onClick={()=>navigate('/user/shopping')}>Xem tất cả sản phẩm</button>
        <div className="underline"></div>
        </div>
    )
}

export default HomePage;