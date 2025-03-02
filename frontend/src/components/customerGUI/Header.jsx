import actionMenu from "../format/actionMenu";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../design/Home/header.css'
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";
import axios from "axios";
export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [notices, setNotices] = useState([])
    const [isList, setIsList] = useState(false)
    useEffect(()=>{
        const fetchNoti = async()=>{
            try{
                const temp = await axios.get(`http://localhost:8000/api/notification/get?id=${currentUser.uid}`)
                if (temp.status != 200){
                    throw new Error("Lỗi khi lấy dữ liệu")
                }
                console.log(temp.data.data)
                setNotices(temp.data.data.reverse()
                    .sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            }
            catch(err){
                console.error("Error: ", err.message)
            }
        }
        fetchNoti()
    },[])
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
                {localStorage.getItem('uid')?<>
                    <a href="/user/promotion">Khuyến mãi</a>
                    <a href="/user/info/history-log">Đơn hàng</a>
                </>:null}
            </div>
            <div className="search-bar" >
                <input type="text" placeholder="Bạn đang tìm kiếm..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                <button onClick={handleSearch}><span>&#128269;</span></button>
            </div>
            {localStorage.getItem('uid')?
            <div className="icons">
                <div>
                <a href="#" onClick={(e) => {e.preventDefault(); navigate('/user/info/notification', {state:{active: 5}})}}><span>&#128276;</span></a>
                {/* <div style={{fontSize: "6px", marginTop:"-12px", marginLeft:"18px", border: "1px solid red", borderRadius:"50px", backgroundColor:"red", textAlign:"center"}}>{notices.length}</div>  */}
                </div>
            <a href="#" onClick={(e)=>{e.preventDefault(); navigate('/user/cart')}}><span>&#128722;</span></a>
            <div className="dropdown-container">
                <a href="#" className="dropdown" id="dropdownButton" onClick={(e) =>{e.preventDefault(); actionMenu()}}>
                    <span>&#128100;</span>
                </a>
                <div className="action-menu" id="actionMenu">
                    <div onClick={(e) =>{e.preventDefault(); navigate('/user/info', {state:{active: 1}})}}><span>&#128100;</span> Quản lý tài khoản</div>
                    <div onClick={(e) =>{e.preventDefault(); navigate('/user/info/history-log', {state:{active: 2}})}}><span>&#128230;</span> Đơn hàng</div>
                    <div onClick={handleLogout}><span>&#x1F512;</span> Đăng xuất</div>
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
