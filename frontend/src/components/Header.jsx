import actionMenu from "./format/actionMenu";
import UserAccountManagement from "./customerGUI/UserAccount";
import { useEffect,useState } from "react";

export default function Header({state,NavigateTo,Search}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            let newData = [];
            try{
                const productResponse = await fetch(
                    `http://localhost:8000/api/product/getAll?filter=${searchQuery}`
                );
                if (!productResponse.ok) throw new Error("Failed to fetch products");
                const nowData = await productResponse.json()
                newData = nowData.data
            }
            catch(e){
                throw new Error(e)
            }
            setData(newData); // Update images state once all images are fetched
        };

        fetchData();
    }, [searchQuery]);
    const handleSearch = () =>{
        console.log("Searching: "+searchQuery)
        console.log(data)
        Search(data)
    }

    return (
        <div className="navbar">
            <div className="logo">Exclusive</div>
            <div className="nav-links">
                <a href="#" onClick={(e) => { e.preventDefault(); NavigateTo('HomePage'); }}>Trang chủ</a>
                <a href="#" onClick={(e) => { e.preventDefault(); NavigateTo('Shopping'); }}>Mua sắm</a>
                <a href="#">Khuyến mãi</a>
                <a href="#">Đơn hàng</a>
            </div>
            <div className="search-bar" >
                <input type="text" placeholder="Bạn đang tìm kiếm..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                <button onClick={handleSearch}><span>&#128269;</span></button>
            </div>
                <div className="icons">
                    <a href="#" ><span>&#128276;</span></a> 
                    <a href="#" onClick={(e)=>{e.preventDefault(); NavigateTo('Cart')}}><span>&#128722;</span></a>
                    <div className="dropdown-container">
                        <a href="#" className="dropdown" id="dropdownButton" onClick={(e) =>{e.preventDefault(); actionMenu()}}>
                            <span>&#128100;</span>
                        </a>
                        <div className="action-menu" id="actionMenu">
                            <div onClick={(e) =>{e.preventDefault(); NavigateTo('User')}}><span>&#128100;</span> Manage My Account</div>
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