import actionMenu from "../format/actionMenu";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../design/Home/header.css'
export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = () =>{
        console.log("Searching: "+searchQuery)
        localStorage.setItem('Squery', searchQuery)
        setSearchQuery("")
        window.location.reload();
    }
    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('uid')
        navigate('/')
    }
    return (
        <div className="navbar">
            <div className="logo">Exclusive</div>
            <div className="nav-links">
                <a href="/user/homepage" >Trang chủ</a>
                <a href="/user/shopping">Mua sắm</a>
                <a href="/user/promotion">Khuyến mãi</a>
                <a href="/user/info/history-log">Đơn hàng</a>
            </div>
            <div className="search-bar" >
                <input type="text" placeholder="Bạn đang tìm kiếm..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                <button onClick={handleSearch}><span>&#128269;</span></button>
            </div>
            {localStorage.getItem('uid')?
            <div className="icons">
            <a href="#" onClick={(e) => {e.preventDefault(); navigate('/user/info/notification', {state:{active: 5}})}}><span>&#128276;</span></a> 
            <a href="#" onClick={(e)=>{e.preventDefault(); navigate('/user/cart')}}><span>&#128722;</span></a>
            <div className="dropdown-container">
                <a href="#" className="dropdown" id="dropdownButton" onClick={(e) =>{e.preventDefault(); actionMenu()}}>
                    <span>&#128100;</span>
                </a>
                <div className="action-menu" id="actionMenu">
                    <div onClick={(e) =>{e.preventDefault(); navigate('/user/info', {state:{active: 1}})}}><span>&#128100;</span> Manage My Account</div>
                    <div onClick={(e) =>{e.preventDefault(); navigate('/user/info/history-log', {state:{active: 2}})}}><span>&#128230;</span> My Orders</div>
                    <div onClick={handleLogout}><span>&#x1F512;</span> Log out</div>
                </div>
            </div>
        </div>:
        <div style={{display: "inline-flex"}}>
            {/* <div style={{cursor: "pointer", marginRight: ""}} onClick={() => navigate('/')}>Đăng ký</div> */}
            <div style={{cursor: "pointer"}} onClick={() => navigate('/')}>Đăng nhập</div>    
        </div>}
                
        </div>
    );
}
