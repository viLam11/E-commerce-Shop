import actionMenu from "./format/actionMenu";
import UserAccountManagement from "./customerGUI/UserAccount";

export default function Header({state,NavigateTo}) {
    return (
        <div className="navbar">
            <div className="logo">Exclusive</div>
            <div className="nav-links">
                <a href="#" onClick={(e) => { e.preventDefault(); NavigateTo('HomePage'); }}>Trang chủ</a>
                <a href="#" onClick={(e) => { e.preventDefault(); NavigateTo('Shopping'); }}>Mua sắm</a>
                <a href="#">Khuyến mãi</a>
                <a href="#">Đơn hàng</a>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Bạn đang tìm kiếm..." />
                <button><span>&#128269;</span></button>
            </div>
                <div className="icons">
                    <a href="#" ><span>&#128276;</span></a> 
                    <a href="#" ><span>&#128722;</span></a>
                    <div className="dropdown-container">
                        <a href="#" className="dropdown" id="dropdownButton" onClick={() => actionMenu()}>
                            <span>&#128100;</span>
                        </a>
                        <div className="action-menu" id="actionMenu">
                            <div onClick={() => NavigateTo('User')}><span>&#128100;</span> Manage My Account</div>
                            <div><span>&#128230;</span> My Orders</div>
                            <div><span>&#10060;</span> My Cancellations</div>
                            <div><span>&#11088;</span> My Reviews</div>
                            <div ><span>&#x1F512;</span> Log out</div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

// export default Header;

// navigation
/*
    onClick={this.navigateToCartPage}
    onClick={this.navigateToUserAccount}
    onClick={this.navigateToHomePage}
    onClick={this.navigateToShoppingPage}
    onClick={this.navigateToPromotionPage}
    onClick={this.LogOut}
*/

/* did Log in
    {this.state.currentUser && (
                <div className="icons">
                    <a href="#"><span>&#128276;</span></a> 
                    <a href="#" ><span>&#128722;</span></a>
                    <div className="dropdown-container">
                        <a href="#" className="dropdown" id="dropdownButton" onClick={() => actionMenu()}>
                            <span>&#128100;</span>
                        </a>
                        <div className="action-menu" id="actionMenu">
                            <div onClick={this.navigateToUserAccount}><span>&#128100;</span> Manage My Account</div>
                            <div><span>&#128230;</span> My Orders</div>
                            <div><span>&#10060;</span> My Cancellations</div>
                            <div><span>&#11088;</span> My Reviews</div>
                            <div onClick={this.LogOut}><span>&#x1F512;</span> Log out</div>
                        </div>
                    </div>
                </div>
            )}
*/