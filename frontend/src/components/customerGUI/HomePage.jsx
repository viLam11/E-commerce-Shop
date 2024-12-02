import Product from "./Product";
import { useState, useEffect } from "react";
function Banner(){
    return (
        <div className="banner">
            <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/k_y_7Ro8-VQ??autoplay=1&loop=1&playlist=k_y_7Ro8-VQ" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen></iframe>        
        </div>
    )
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
function CategoryBar(){
    return(
        <div className="searching">
            <h3>Phân loại</h3>
            <div className="category-buttons">
                <a className="category-type" href="#" onClick={() => this.navigateToByCategory('c01')}>
                    <div>
                        <img src="../../public/img/s-l960 (1).webp" alt='Phone' style={{marginBottom: '6px' ,marginTop: '3px'}}/>
                        <br /> <span>Điện thoại</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={() => this.navigateToByCategory('c04')}>
                    <div>
                        <img src="../../public/img/s-l960.webp" style={{marginBottom: '12px' }}/>
                        <br /> <span>Đồng hồ thông minh</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={() => this.navigateToByCategory('c02')}>
                    <div>
                        <img src= "../../public/img/s-l960 (2).webp" style={{marginBottom: '23px',marginTop: '15px'}}/>
                        <br /> <span>Laptop</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={() => this.navigateToByCategory('c03')}>
                    <div>
                        <img src="../../public/img/s-l960 (3).webp" style={{marginBottom: '26px' ,marginTop: '8px'}}/>
                        <br /> <span>Tablet</span>
                    </div>
                </a>
                <a className="category-type" href="#" onClick={() => this.navigateToByCategory('c05')}>
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
    const sortedItems = state.productData
        ? [...state.productData].sort((a, b) => (b.sold || 0) - (a.sold || 0))
        : null;

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
    }, []);
    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        console.log("Next")
        setStart((prev) => Math.min(prev + 4, sortedItems.length - 4));
        setEnd((prev) => Math.min(prev + 4, sortedItems.length));
    };
    
    const handlePrevious = () => {
        console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    
    return (
        <div className="spotlight">
            {/* <h2>Tháng này</h2> */}
            <h2 className="view-all-container">
                Các sản phẩm đang bán chạy
                
            </h2>
            <span onClick = {handlePrevious}>&#x2B05;</span><span onClick={handleNext}>&#x27A1;</span>
            <div className="spotlight-list">
                {sortedItems
                    ? sortedItems.slice(start, end).map((row, index) => {
                          const img = images[row.product_id];
                          const productCate = state.categoryData
                              ? state.categoryData.find(item => item.cate_id === row.cate_id)
                              : null;

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
                                          <span>({row.sold})</span>
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
function HomePage({state,ViewProductDetail,NavigateTo}){
    console.log("Home Data: " + state.productData)
    return(<div id ='home'>
        <div className="container">
            <Banner />
        </div>
        <Product state = {state} ViewProductDetail = {ViewProductDetail}/>
        <div className="view-all-container">
            <button className="view-all-button" onClick={()=>NavigateTo('Shopping')}>Xem tất cả sản phẩm</button>
            <div className="underline"></div>
        </div>
        
        <CategoryBar />
        <FlashProduct state ={state} ViewProductDetail={ViewProductDetail}/>
        <button className="view-all" onClick={()=>NavigateTo('Shopping')}>Xem tất cả sản phẩm</button>
        <div className="underline"></div>
        </div>
    )
}

export default HomePage;