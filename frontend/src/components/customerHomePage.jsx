import React , {Component,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client'
import AccountMenu from './AccountMenu';

export class PageComponent extends React.Component {
    // Define the Header as a class method
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'HomePage',
            productData: [],
            imageData:[],
            categoryData:[],
            reviews:[],
            users:[],
            isViewProduct:false,
            currentProduct: null,
            currentCategory: null,
            currentImage: null
        };
        this.Header = this.Header.bind(this);
        this.Footer = this.Footer.bind(this);
        this.navigateToHomePage = this.navigateToHomePage.bind(this);
        this.navigateToShoppingPage = this.navigateToShoppingPage.bind(this);
        this.navigateToPromotionPage = this.navigateToPromotionPage.bind(this);
        this.navigateToCartPage = this.navigateToCartPage.bind(this);
        this.navigateToViewProduct = this.navigateToViewProduct.bind(this);
        this.navigateToByCategory = this.navigateToByCategory.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/users') // Replace with actual backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => this.setState({ users: data }))
            .catch(error => console.error('Error fetching data:', error));
        fetch('http://localhost:3000/api/product') // Replace with actual backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => this.setState({ productData: data }))
            .catch(error => console.error('Error fetching data:', error));
        fetch('http://localhost:3000/api/image') // Replace with actual backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => this.setState({ imageData: data }))
            .catch(error => console.error('Error fetching data:', error));
        fetch('http://localhost:3000/api/category') // Replace with actual backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => this.setState({ categoryData: data }))
            .catch(error => console.error('Error fetching data:', error));
        fetch('http://localhost:3000/api/reviews') // Replace with actual backend API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('fetch reviews\n');
                return response.json();
            })
            .then(data => this.setState({ reviews: data }))
            .catch(error => console.error('Error fetching data:', error));
    }

    navigateToHomePage() {
        
        this.setState({ currentPage: 'HomePage' });
    }

    // Phương thức chuyển đến trang mua sắm
    navigateToShoppingPage() {
        
        this.setState({ currentPage: 'ShoppingPage' });
    }

    // Phương thức chuyển đến trang khuyến mãi
    navigateToPromotionPage() {
        
        this.setState({ currentPage: 'PromotionPage' });
    }

    navigateToCartPage() {
        
        this.setState({ currentPage: 'CartPage' });
    }

    navigateToViewProduct(product, image, cate){
        this.setState({
            currentPage: 'View',
            currentProduct: product,
            currentImage: image,
            currentCategory:cate
        })
    }

    navigateToByCategory(cate){
        this.setState({
            currentPage: 'Category',
            currentCategory:cate
        })
    }

    renderPage() {
        const { currentPage, currentProduct } = this.state;
        
        switch (currentPage) {
            case 'HomePage':
                return <HomePage 
                    navigateToByCategory = {this.navigateToByCategory} 
                    navigateToViewProduct={this.navigateToViewProduct} 
                    productData={this.state.productData} 
                    imageData={this.state.imageData}
                    cateData = {this.state.categoryData}
                />; // Gọi hàm render của HomePage
            case 'ShoppingPage':
                return <ShoppingPage />; // Gọi hàm render của shoppingPage
            case 'PromotionPage':
                return <PromotionPage />; // Gọi hàm render của promotionPage
            case 'CartPage':
                return <CartPage />; // Gọi hàm render của CartPage
            case 'View':
                return <ViewProduct 
                    navigateToViewProduct={this.navigateToViewProduct} 
                    navigateToByCategory = {this.navigateToByCategory}
                    product={currentProduct} 
                    imageData={currentProduct}
                    reviews = {this.state.reviews}
                    users = {this.state.users}
                />
            case 'Category':
                return <Categories 
                    navigateToByCategory = {this.navigateToByCategory}
                    navigateToViewProduct = {this.navigateToViewProduct}
                    productData={this.state.productData} 
                    cateData = {this.state.categoryData}
                    category = {this.state.currentCategory}
                    imageData={this.state.imageData}
                />
            default:
                return <HomePage 
                    navigateToByCategory = {this.navigateToByCategory} 
                    navigateToViewProduct={this.navigateToViewProduct} 
                    productData={this.state.productData} 
                    imageData={this.state.imageData}
                    cateData = {this.state.categoryData}
                />; // Gọi hàm render của HomePage; // Render HomePage mặc định
        }
    }
    //----------------HEADER & FOOTER-----------------
    Header() {
        return (
            <div className="navbar">
                <div className="logo">Exclusive</div>
                <div className="nav-links">
                    <a href="#" onClick={this.navigateToHomePage}>Trang chủ</a>
                    <a href="#" onClick={this.navigateToShoppingPage}>Mua sắm</a>
                    <a href="#" onClick={this.navigateToPromotionPage}>Khuyến mãi</a>
                    <a href="#">Đơn hàng</a>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Bạn đang tìm kiếm..." />
                    <button><span>&#128269;</span></button>
                </div>
                <div className="icons">
                    <a href="#"><span>&#128276;</span></a> 
                    <a href="#" onClick={this.navigateToCartPage}><span>&#128722;</span></a> 
                    <a href="#" ><span>&#128100;</span></a> 
                </div>
            </div>
        );
    }
    
    Footer(){
        return(
            <footer className="footer">
                <div className="footer-section">
                    <h3>Exclusive</h3>
                    <div className="email-subscribe">
                        <input type="email" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </div>
                </div>
            
                <div className="footer-section contact-info">
                    <h3>Liên hệ</h3>
                    <p>📍 Lý Thường Kiệt, quận 10, TP.HCM</p>
                    <p>✉️ <a href="mailto:exclusive@gmail.com">exclusive@gmail.com</a></p>
                    <p>📞 +1 800 854-36-80</p>
                    <div className="social-icons">
                        <a href="#"><i class="bi bi-messenger"></i></a>
                        <a href="#"><i class="bi bi-facebook"></i></a>
                        <a href="#"><i class="bi bi-envelope"></i></a>
                    </div>
                </div>
            
                <div className="footer-section">
                    <h3>Sản phẩm</h3>
                    <a href="#">Trang chủ</a><br />
                    <a href="#">Điện thoại</a><br />
                    <a href="#">Laptop</a><br />
                    <a href="#">Máy tính bảng</a><br />
                    <a href="#">Phụ kiện</a>
                </div>
            
                <div className="footer-section">
                    <h3>Tài khoản</h3>
                    <a href="#">Thông tin cá nhân</a><br />
                    <a href="#" >Đăng nhập</a><br />
                    <a href="#">Đăng ký</a><br />
                    <a href="#">Mua sắm</a><br />
                    <a href="#">Giỏ hàng</a>
                </div>
            
                <div className="footer-section">
                    <h3>Công ty Exclusive</h3>
                    <a href="#">Giới thiệu</a><br />
                    <a href="#">Công việc</a><br/>
                    <a href="#">Hỏi - đáp</a><br/>
                    <a href="#">Đội ngũ</a><br/>
                    <a href="#">Liên hệ</a>
                </div>
            </footer>
        )
    }

    //-------View Product-------------
    Product(){
        return (
            <div className="spotlight">
                <h2>Sản phẩm liên quan</h2>
                {this.DetailProduct()}
            </div>
        )
    }

    DetailProduct() {
        const { imageData, productData, navigateToViewProduct,categoryData } = this.props;
        if (!this.state.productData) throw ("No data defined")
        return (
            <div className="spotlight-list">
                {this.state.productData.slice(0,10).map((row, index) => {
                    // Lọc ảnh dựa trên product_id
                    const productImage = this.state.imageData.find(item => item.product_id === row.product_id);
                    const productCate  = this.state.categoryData.find(item => item.cate_id === row.cate_id);
                    return (
                        <div className="spotlight-product" onClick={() => navigateToViewProduct(row, productImage,productCate)} key={index}>
                            <div>
                                <span className="discount">-35%</span>
                                <span className="icon">
                                    <a href="#"><img src="icon/notifications_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png" alt="Notifications" /></a>
                                    <a href="#"><img src="icon/shopping_cart_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png" alt="Shopping Cart" /></a>
                                </span>
                                <br />
                                {/* Kiểm tra và sử dụng đường dẫn ảnh nếu tìm thấy */}
                                <img 
                                    className="product-img" 
                                    src={productImage ? productImage.image_url : "default_image.png"} 
                                    alt="Product" 
                                />
                            </div>
                            <div className='prod-data'>
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
                })}
            </div>
        );
    }
    
    


    //render
    render() {
        return (
            <div>
                {this.Header()}
                {this.renderPage()}
                {this.Footer()}
            </div>
        );
    }
}

class HomePage extends PageComponent{
    constructor(props) {
        super(props);
        this.Home = this.Home.bind(this);
        this.navigateToByCategory = this.props.navigateToByCategory.bind(this);
    }
    Home(){
        return(<div id ='home'>
            <div className="container">
                {this.banner()}
            </div>
            {this.pagination()}
            {this.Product()}
            
            <div className="view-all-container">
                <button className="view-all-button">Xem tất cả sản phẩm</button>
                <div className="underline"></div>
            </div>
            
            {this.category()}
            
            <div className="underline"></div>
            
            {this.flashProduct()}
            {this.advertisement()}
            {this.discovery()}
            {this.newProduct()}
            </div>
        )
    }
    banner(){
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
    pagination(){
        return(
            <div className="pagination">
                <span></span>
                <span class="active"></span>
                <span></span>
                <span></span>
            </div>
        )
    }
    category(){
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
    flashProduct(){
        return(
            <div className="spotlight">
                <h2>Tháng này</h2>
                
                <div className="view-all-container">
                    <h3>Các sản phẩm đang bán chạy</h3>
                    <button className="view-all-button">Xem tất cả sản phẩm</button>
                </div>
                
                <div className="spotlight-list">
                    
                </div>
            </div>
        )
    }
    advertisement(){
        return (
            <div className="promo-container">
                <div className="promo-text">
                    <p>Categories</p>
                    <h1>Enhance Your Music Experience</h1>
                    <div className="countdown">
                        <div>
                            <span id="days">05</span>
                            Days
                        </div>
                        <div>
                            <span id="hours">23</span>
                            Hours
                        </div>
                        <div>
                            <span id="minutes">59</span>
                            Minutes
                        </div>
                        <div>
                            <span id="seconds">35</span>
                            Seconds
                        </div>
                    </div>
                    <a href="#" className="promo-button">Buy Now!</a>
                </div>
                <div class="promo-image">
                    <img src="../../public/img/marshall.webp" alt="Speaker" />
                </div>
            </div>
        )
    }

    discovery(){
        return(
            <div className="product-section">
                <div className="section-header">
                    <h2>Khám phá công nghệ</h2>
                    <div className="navigation-arrows">
                        <button>&larr;</button>
                        <button>&rarr;</button>
                    </div>
                </div>
            
                <div className="product-grid">
                
                    <div className="product-card">
                        <img src="https://via.placeholder.com/150" alt="ASUS FHD Gaming Laptop"/>
                        <h3>ASUS FHD Gaming Laptop</h3>
                        <p className="price">$700</p>
                        <div className="rating">★★★★☆ (325)</div>
                        <div className="color-options">
                            <span className="color black"></span>
                            <span className="color red"></span>
                        </div>
                    </div>
                    
                    
                    <div className="product-card">
                        <img src="https://via.placeholder.com/150" alt="Viettel T2 4G"/>
                        <h3>Viettel T2 4G</h3>
                        <p className="price">$660</p>
                        <div className="rating">★★★★★ (55)</div>
                        <div className="color-options">
                            <span className="color black"></span>
                            <span className="color red"></span>
                        </div>
                    </div>
            
                
                    <div className="product-card new">
                        <span className="badge">NEW</span>
                        <img src="https://via.placeholder.com/150" alt="GP11 Shooter USB Gamepad"/>
                        <h3>GP11 Shooter USB Gamepad</h3>
                        <p className="price">$660</p>
                        <div className="rating">★★★★★ (55)</div>
                        <div className="color-options">
                            <span className="color black"></span>
                            <span className="color red"></span>
                        </div>
                    </div>
                </div>
            
                <button className="view-all-button">View All Products</button>
            </div>
        )
    }

    newProduct(){
        return (
            <div className="new-arrivals-section">
                <div className="section-header">
                    <h2>Hàng mới về</h2>
                </div>
            
                <div className="product-highlights">
                    <div className="feature-large">
                        <img src="https://via.placeholder.com/300x200" alt="Swarovski and Diamond Studded Notebook"/>
                        <div className="feature-info">
                            <h3>Swarovski and Diamond Studded Notebook</h3>
                            <p>Giá trị của laptop chủ yếu đến từ hàng trăm viên kim cương Swarovski vô cùng quý giá trên nắp máy.</p>
                            <button>Free Now</button>
                        </div>
                    </div>
            
                    <div className="feature-small">
                        <div className="small-feature">
                            <img src="https://via.placeholder.com/150x100" alt="Huawei Collection"/>
                            <div className="small-feature-info">
                                <h3>Huawei Collections</h3>
                                <p>Building a Fully Connected, Intelligent World.</p>
                                <button>Shop Now</button>
                            </div>
                        </div>
                        <div className="small-feature">
                            <img src="https://via.placeholder.com/150x100" alt="Speakers"/>
                            <div className="small-feature-info">
                                <h3>Speakers</h3>
                                <p>Amazon wireless speakers</p>
                                <button>Shop Now</button>
                            </div>
                        </div>
                        <div className="small-feature">
                            <img src="https://via.placeholder.com/150x100" alt="Marshall"/>
                            <div className="small-feature-info">
                                <h3>Marshall</h3>
                                <p>New version speakers</p>
                                <button>Shop Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    service(){
        return(
            <div className="service-features">
                    <div className="service">
                        <i className="icon">🚚</i>
                        <h4>Miễn phí vận chuyển</h4>
                        <p>Free delivery for all orders over $140</p>
                    </div>
                    <div className="service">
                        <i className="icon">💬</i>
                        <h4>Tư vấn trực tuyến 24/7</h4>
                        <p>Friendly 24/7 customer support</p>
                    </div>
                    <div className="service">
                        <i className="icon">🔒</i>
                        <h4>Chính sách bảo hành</h4>
                        <p>We return money within 30 days</p>
                    </div>
                </div>
        )
    }
    render(){
            return (
                <div>
                    {this.Home()}
                </div>
            )
    }
}

class ViewProduct extends PageComponent{
    constructor(props) {
        super(props);
        this.Detail = this.Detail.bind(this);
    }

    Detail(){
        
        const { product, imageData, categoryData } = this.props;
        if (!product) {
            alert('No product to view')
            return null;
        }
        const mainImage = this.state.imageData.find(item => item.product_id === product.product_id && item.ismain == true);
        const otherImage = this.state.imageData.filter(item => item.product_id === product.product_id && item.ismain == false);
        const instantCate = this.state.categoryData.find(item => item.cate_id === product.cate_id);
        return(
            <>
            <div className="breadcrumbs">
                <div>
                    <a href="#" className='off'>Mua sắm</a> / <a href="#" className='off'>{instantCate? instantCate.cate_name:""}</a> / {product.pname}
                </div>
            </div>
            <div className="product-page">
                
                <div className="product-container">
                    <div class="thumbnails">
                        {otherImage.map((item, index) => {
                           return(
                                <div className='thumnail'>
                                    <img src={item?item.image_url:""} alt="" />
                                </div>
                           );
                        })}
                    </div>
                    <div class="main-image">
                        <img src={mainImage?mainImage.image_url:""} alt="Thumbnail"/>
                    </div>
                    <div class="product-details">
                        <h1>{product.pname}</h1>
                        <div class="rating-stock">
                            <p>★★★★★ (150 Reviews) | <span class="stock-status">In Stock</span></p>
                        </div>
                        <p class="price">{(() => {
                                        const format = String(product.price);
                                        let token = " đ";
                                        let checkpoint = 0;

                                        for (let i = format.length - 1; i >= 0; i--) {
                                            token = format[i] + token;
                                            checkpoint++;

                                            // Thêm dấu "." sau mỗi 3 chữ số
                                            if (checkpoint === 3 && i !== 0) {
                                                token = "." + token;
                                                checkpoint = 0;
                                            }
                                        }

                                        return token;
                                    })()}</p>
                        <div class="color-options">
                            <p>Colours:</p>
                            <span class="color-swatch"></span>
                        </div>
                        <div class="purchase-options">
                            <div class="quantity">
                                <input id="quantity-val" type="number" defaultValue="1" min = "0" max={product.quantity}/>
                            </div>
                            <button class="buy-now">Buy Now</button>
                            <button class="add-to-cart">Add to cart</button>
                        </div>
                        <div class="info-box">
                            <div class="info-item">
                                <p><strong>Giao hàng nhanh chóng</strong></p>
                                <p>Giao hàng trong vòng 7 ngày kể từ khi thanh toán*</p>
                            </div>
                            <div class="info-item">
                                <p><strong>Chính sách đổi trả</strong></p>
                                <p>Miễn phí trả hàng trong vòng 30 ngày. <a href="#">Chi tiết</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    Description(){
        const { product } = this.props;
        if (!product) return null;
        return(
            <div className='prod-description'>
                <h3>Thông tin chi tiết sản phẩm</h3>
                <div className='description'>{product.description}</div>
            </div>
        )
    }

    Review(){
        const { product , reviews, users} = this.props;
        if (!product) return null;
        console.log(reviews)
        const review = reviews?(reviews.filter(item => item.product_id == product.product_id)):null;
        console.log("\nfor: " + review + "\n")
        let averageRate = "0.0";
        if (review && review.length > 0) {
            let rate = 0.0;
            for (let i = 0; i < review.length; i++) {
                rate += parseFloat(review[i].rating);
            }
            averageRate = (rate / review.length).toFixed(1); // làm tròn 1 chữ số thập phân
        }
        return(
            <div className='review-prod'>
                <h3>Đánh giá và nhận xét {product.pname}</h3>
                <div className='view-review'>
                    <div>
                        <p>{averageRate}/5</p>
                        <p>Star</p>
                        <p>Số lượng đánh giá</p>
                    </div>
                    <div className='view-detail'>
                        Chi tiết hạng đánh giá
                    </div>
                </div>
                <div className='review-of-customer'>
                    {review?review.map((token,index)=>{
                        return (
                            <div className='a-review'>
                                <div className='By'>Review By: {users?users.find(item => item.uid == token.uid).username:""}</div>
                                <div>Review time: {token.time}</div>
                                <div>Rating: {token.rating}</div>
                                <div>Comment: {token.comment}</div>
                            </div>
                        )
                    }):null}
                    <form>
                    <input type='text' placeholder="Thêm đánh giá" />
                    <input type='image' src='../../public/icon/arrow_right_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'/>
                    </form>
                </div>
            </div>
        )
    }

    render(){
        
        return(
            <div className='viewpage'>
                {this.Detail()}
                {this.Description()}
                {this.Review()}
                {this.Product()}
            </div>
        )
    }
}

class Categories extends PageComponent{
    constructor(props) {
        super(props);
        this.CategoryDetail = this.CategoryDetail.bind(this);
    }
    
    CategoryProduct(){
        const {cateData, category, productData, imageData,navigateToViewProduct} = this.props;
        if (!cateData){
            alert('No category defined')
            throw ('404 Not Found');
        }
        const prod = productData.filter(item => item.cate_id == category);
        return(
            <>
                <div>
                    <h4>Chọn theo tiêu chí</h4>
                    <div>
                        <select>
                            <option value = "">--Chọn hãng công nghệ--</option>
                            <option value = "Samsung">Samsung</option>
                            <option value = "Apple">Apple</option>
                            <option value = "Xiaomi">Xiaomi</option>
                            <option value = "Marshall">Marshall</option>
                        </select>
                        <select>
                            <option value="">--Sắp xếp theo giá tiền--</option>
                            <option value="arc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                    <div>
                        {prod.map((item, index) =>{
                            const img = imageData?imageData.find(row => row.product_id == item.product_id && row.ismain == true).image_url:"";
                            return (
                            <div class="product-card" onClick={() => navigateToViewProduct(item, img, category)}>
                                <img src={img} alt={item.pname} />
                                <h3>{item.pname}</h3>
                                <p class="price">{(() => {
                                        const format = String(item.price);
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
                                    })()}</p>
                                <button class="cart-btn">Thêm vào giỏ hàng</button>
                            </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }

    CategoryDetail(){
        const {cateData, category} = this.props;
        if (!cateData){
            alert('No category defined')
            throw ('404 Not Found');
        }
        return (
            <>
                <div className="breadcrumbs">
                    <div>
                        <a href="#" className='shopping'>Mua sắm</a> / <a href="#">{cateData.find(item => item.cate_id == category).cate_name}</a> /
                    </div> 
                    {this.CategoryProduct()}
                </div>
            </>
        )
    }

    render(){
        return (
            <>
                {this.CategoryDetail()}
            </>
        )
    }
}

class CartPage extends PageComponent{
    constructor(props) {
        super(props);
        this.Cart = this.Cart.bind(this);
    }
    Cart(){
        return (
            <div>
                Giỏ hàng
            </div>
        )
    }
    render(){
        <div>
            {this.Cart()}
        </div>
    }
}

class PromotionPage extends PageComponent{
    constructor(props) {
        super(props);
        this.Promotion = this.Promotion.bind(this);
    }
    Promotion(){
        return (
            <div>
                Khuyến mãi
            </div>
        )
    }
    render(){
        <div>
            {this.Promotion()}
        </div>
    }
}

class ShoppingPage extends PageComponent{
    constructor(props) {
        super(props);
        this.Shopping = this.Shopping.bind(this);
    }
    Shopping(){
        return (
            <div className='view-state'>
                {this.Product()}
            </div>
        )
    }
    render(){
        return(
            <div className='Shopping'>
                {this.Shopping()}
            </div>
        )
    }
}

export default PageComponent;