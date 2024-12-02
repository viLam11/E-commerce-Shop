
function Footer(){
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

export default Footer;

//navigation
/*
    onClick={this.navigateToHomePage}
*/