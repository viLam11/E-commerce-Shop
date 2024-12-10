import Product from "./Product";
import { useState, useEffect } from "react";
function Banner({ViewCategories}) {
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
                    <h2 onClick={()=>ViewCategories('c01')}>Điện thoại</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>ViewCategories('c02')}>Laptop</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>ViewCategories('c03')}>Máy tính bảng</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>ViewCategories('c04')}>Đồng hồ thông minh</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 onClick={()=>ViewCategories('c05')}>Phụ kiện</h2>
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
function Pagination(){
    return(
        <div className="pagination">
            <span></span>
            <span class="active"></span>
            <span></span>
            <span></span>
        </div>
    )
}
function CategoryBar({ViewCategories}){
    return(
        <div className="searching">
            <h3>Phân loại</h3>
            <div className="category-buttons">
                <a className="category-type" href="#" onClick={(e) =>{e.preventDefault(); ViewCategories('c01')}}>
                    <div>
                        <img src="../../public/img/s-l960 (1).webp" alt='Phone' style={{marginBottom: '6px' ,marginTop: '3px'}}/>
                        <br /> <span>Điện thoại</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={(e) =>{e.preventDefault(); ViewCategories('c04')}}>
                    <div>
                        <img src="../../public/img/s-l960.webp" style={{marginBottom: '12px' }}/>
                        <br /> <span>Đồng hồ thông minh</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={(e) =>{e.preventDefault(); ViewCategories('c02')}}>
                    <div>
                        <img src= "../../public/img/s-l960 (2).webp" style={{marginBottom: '23px',marginTop: '15px'}}/>
                        <br /> <span>Laptop</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={(e) =>{e.preventDefault(); ViewCategories('c03')}}>
                    <div>
                        <img src="../../public/img/s-l960 (3).webp" style={{marginBottom: '26px' ,marginTop: '8px'}}/>
                        <br /> <span>Tablet</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={(e) =>{e.preventDefault(); ViewCategories('c05')}}>
                    <div>
                        <img src="../../public/img/mobile-phone-accessories-for-sell-e-commerce-portal.jpg"style={{marginBottom: '16px' ,marginTop: '8px'}}/>
                        <br /> <span>Phụ kiện</span>
                    </div>
                </a>
            </div>
        </div>
    )
}

function FlashProduct({ state, ViewProductDetail }) {
    const [images, setImages] = useState({}); // Store images for products by ID

    // Sort products by `sold` property
    const [sortedItems, setProduct] = useState([])
    useEffect(()=>{
        setProduct(state.productData
            ? [...state.productData].sort((a, b) => (b.sold || 0) - (a.sold || 0)):[])
    },[]) 
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
    }, []);

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
                          const productCate = state.categoryData
                              ? state.categoryData.find(item => item.cate_id === row.cate_id)
                              : null;
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
                                  <div className="product-view" onClick={() => ViewProductDetail(row.product_id)}>
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

function NewProduct(){
    const {productData, imageData} = this.props;
    const sortedItems = productData?[...productData].sort((a, b) => new Date(a.create_time) - new Date(b.create_time)):null;
    const fprod = sortedItems && sortedItems.length > 0 ? sortedItems[0]:null;
    const cid = fprod?fprod.product_id:null;
    const image1 = imageData?imageData.find(item => item.product_id == cid && item.ismain == true):null;
    return (
        <div className="new-arrivals-section">
            <div className="section-header">
                <h2>Hàng mới về</h2>
            </div>
        
            <div className="product-highlights">
                <div className="feature-large">
                    <img src={image1} alt={fprod?fprod.pname : null}/>
                    <div className="feature-info">
                        <h3>{fprod?fprod.pname : null}</h3>
                        <p>{fprod?fprod.description : null}</p>
                        <button>Buy Now</button>
                    </div>
                </div>
        
                <div className="feature-small">
                    {sortedItems?sortedItems.slice(1,4).map((token,index)=>{
                        const cid = token?token.product_id:null;
                        const image = imageData?imageData.find(item => item.product_id == cid && item.ismain == true):null;
                        return (
                            <div key ={index} className="small-feature">
                                <img src={image} alt="Huawei Collection"/>
                                <div className="small-feature-info">
                                    <h3>{token.pname}</h3>
                                    <p>{token.description}</p>
                                    <button>Shop Now</button>
                                </div>
                            </div>
                        )
                    }):null}
                </div>
            </div>
        </div>
    )
}
function HomePage({state,ViewProductDetail,NavigateTo,ViewCategories}){
    //console.log("Home Data: " + state.productData)
    return(<div id ='home'>
        <div className="container">
            <Banner ViewCategories={ViewCategories}/>
        </div>
        <Product state = {state} ViewProductDetail = {ViewProductDetail}/>
        <div className="view-all-container">
            <button className="view-all-button" onClick={()=>NavigateTo('Shopping')}>Xem tất cả sản phẩm</button>
            <div className="underline"></div>
        </div>
        
        <CategoryBar ViewCategories={ViewCategories}/>
        <FlashProduct state ={state} ViewProductDetail={ViewProductDetail}/>
        <button className="view-all" onClick={()=>NavigateTo('Shopping')}>Xem tất cả sản phẩm</button>
        <div className="underline"></div>
        </div>
    )
}

export default HomePage;