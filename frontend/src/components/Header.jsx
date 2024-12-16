import actionMenu from "./format/actionMenu";
import UserAccountManagement from "./customerGUI/UserAccount";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = () =>{
        console.log("Searching: "+searchQuery)
        localStorage.setItem('Squery', searchQuery)
    }
    const navigate = useNavigate()
    return (
        <div className="navbar">
            <div className="logo">Exclusive</div>
            <div className="nav-links">
                <a href="/user/homepage" >Trang chủ</a>
                <a href="/user/shopping">Mua sắm</a>
                <a href="/user/promotion">Khuyến mãi</a>
                <a href="/user/history-log">Đơn hàng</a>
            </div>
            <div className="search-bar" >
                <input type="text" placeholder="Bạn đang tìm kiếm..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                <button onClick={handleSearch}><span>&#128269;</span></button>
            </div>
                <div className="icons">
                    <a href="#" ><span>&#128276;</span></a> 
                    <a href="#" onClick={(e)=>{e.preventDefault(); navigate('/user/cart')}}><span>&#128722;</span></a>
                    <div className="dropdown-container">
                        <a href="#" className="dropdown" id="dropdownButton" onClick={(e) =>{e.preventDefault(); actionMenu()}}>
                            <span>&#128100;</span>
                        </a>
                        <div className="action-menu" id="actionMenu">
                            <div onClick={(e) =>{e.preventDefault(); navigate(`/user/info`)}}><span>&#128100;</span> Manage My Account</div>
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